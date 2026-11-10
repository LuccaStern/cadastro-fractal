"use server";

import { criarCliente } from "@/lib/clientes";
import type { Cliente } from "@/types/cliente";

// Tipo criado para devolver mensagens de erro por campo
type TextoPorCampo = Partial<Record<keyof Cliente, string>>;

export type EstadoCadastro = {
  sucesso: boolean;
  mensagem: string;
  erros?: TextoPorCampo;
  valores?: TextoPorCampo;
};

// Verifica se o valor do FormData.get() é string, se não for devolve ""
function lerTexto(formData: FormData, campo: keyof Cliente): string {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

// Valida os dados e devolve as mensagens de erro
function validar(cliente: Cliente): TextoPorCampo {
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

export async function cadastrarCliente(
  _estadoAnterior: EstadoCadastro,
  formData: FormData
): Promise<EstadoCadastro> {
  // Object.fromEntries(formData) criaria um objeto com todos os campos do formulário,
  // incluindo os que não fazem parte da aplicação.
  // Para prevenir, deve-se montar o objeto campo a campo
  const cliente: Cliente = {
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

  try {
    const resultado = await criarCliente(cliente);

    if (!resultado.ok) {
      return {
        sucesso: false,
        mensagem: "Este e-mail já está cadastrado.",
        erros: { email: "E-mail já cadastrado." },
        valores: cliente,
      };
    }

    return { sucesso: true, mensagem: "Cliente cadastrado com sucesso!" };
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