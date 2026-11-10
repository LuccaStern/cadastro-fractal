"use server";

import { criarCliente, consultarClientes, atualizarCliente } from "@/lib/clientes";
import type { Cliente, DadosCliente } from "@/types/cliente";

// Tipo criado para devolver mensagens de erro por campo
type TextoPorCampo = Partial<Record<keyof DadosCliente, string>>;

// Tipo para retornar o resultado do cadastro, se há erros e quais eles são
export type EstadoCadastro = {
  sucesso: boolean;
  mensagem: string;
  erros?: TextoPorCampo;
  valores?: TextoPorCampo; // Valores originais dos campos para que o usuário possa corrigir 
};

// Tipo da resposta da consulta à lista de Clientes
export type EstadoConsulta = {
  sucesso: boolean;
  clientes: Cliente[];
  mensagem: string;
};

// Verifica se o valor do FormData.get() é string, se não for devolve ""
function lerTexto(formData: FormData, campo: keyof DadosCliente): string {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

// Valida os dados e devolve as mensagens de erro
function validar(cliente: DadosCliente): TextoPorCampo {
  const erros: TextoPorCampo = {};
  
  // Validação do nome, limites sugeridos pelo Claude
  if (cliente.nome.length < 2 || cliente.nome.length > 100) {
    erros.nome = "Nome tem que ter entre 2 e 100 caracteres";
  }

  // Não coloquei validação pro telefone porque vi no arquivo CSV que há clientes internacionais
  // e os formatos de telefone são muito variados

  // Um email não pode conter mais do que 254 caracteres e deve ter o formato "local@dominio"
  // representado pela regex abaixo
  if (cliente.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
    erros.email = "Informe um e-mail válido.";
  }

  // Validação de endereço, limites sugeridos pelo Claude
  if (cliente.endereco.length < 5 || cliente.endereco.length > 200) {
    erros.endereco = "Informe um endereço com 5 a 200 caracteres.";
  }

  return erros;
}

// Cadastra ou Atualiza o Cliente
export async function cadastrarCliente(
  _estadoAnterior: EstadoCadastro,
  formData: FormData,
  oldClient?: Cliente // Caso haja esse parâmetro, o Cliente será atualizado
): Promise<EstadoCadastro> {

  // Object.fromEntries(formData) criaria um objeto com todos os campos do formulário,
  // incluindo os que não fazem parte da aplicação.
  // Para prevenir, deve-se montar o objeto campo a campo
  const cliente: DadosCliente = {
    nome: lerTexto(formData, "nome"),
    telefone: lerTexto(formData, "telefone"),
    email: lerTexto(formData, "email").toLowerCase(),
    endereco: lerTexto(formData, "endereco"),
  };

  // Por mais que já tenha validação no front-end, é importante validar também no back-end
  const erros = validar(cliente);
  if (Object.keys(erros).length > 0) {
    return { sucesso: false, mensagem: "Corrija os campos destacados.", erros, valores: cliente };
  }

  // Decide de deve Atualizar ou Criar um novo e trata os errros
  try {
    const result = oldClient ? await atualizarCliente(oldClient, cliente) : await criarCliente(cliente)
    
    // Caso esteja Ok, não há mensagem. Se não estiver Ok e deveria ter sido atualizado,
    // diz que não que não encontrou o cliente a ser atualizado. Caso tenha dado erro e
    // deveria ter sido criado, o catch trata, por isso não há mensagem.
    const msg = result.ok ? "" : oldClient ? "Cliente a ser atualizado não encontrado" : ""
    
    return { sucesso: result.ok, mensagem: msg };
  } catch (erro) {

    // Log detalhado somente no servidor. O usuário recebe uma mensagem genérica
    console.error("Erro ao salvar cliente:", erro);

    return {
      sucesso: false,
      mensagem: "Não foi possível salvar agora. Tente novamente em instantes.",
      valores: cliente,
    };
  }
}

// Lista os Clientes no MongoDB
export async function listaClientes(): Promise<EstadoConsulta> {
  try {
    const resultado = await consultarClientes();
    return { 
      sucesso: resultado.ok,
      clientes: resultado.clientes,
      mensagem: "" // Se não há erro, não há mensagem
    }
  } catch (erro) {
    // Log detalhado somente no servidor. O usuário recebe uma mensagem genérica
    console.error("Erro ao consultar clientes:", erro);
    return { sucesso: false, clientes: [], mensagem: "Não foi possível consultar os clientes agora." };
  }
}