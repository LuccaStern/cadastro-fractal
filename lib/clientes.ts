import "server-only"; // Impede que seja executado no cliente, impedindo que a URI e o driver cheguem ao navegador
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { Cliente, DadosCliente } from "@/types/cliente";

// Conecta com a coleção
async function colecaoClientes() {
  const db = await getDb();
  return db.collection<DadosCliente>("clientes");
}

// Tipos dos resultados. Não há mensagens pois os erros são tratados em app/action.ts
export type ResultadoCriacao = { ok: boolean };
export type ResultadoConsulta = { ok: true; clientes: Cliente[] };

// Adiciona o cliente
export async function criarCliente(cliente: DadosCliente): Promise<ResultadoCriacao> {
  const colecao = await colecaoClientes();

    await colecao.insertOne(cliente);
    return { ok: true };
}

// Retorna a lista de todos os clientes no banco
export async function consultarClientes(): Promise<ResultadoConsulta> {
  const colecao = await colecaoClientes();

  const resultados = (await colecao.find().toArray()).map((cliente) => ({
    id: cliente._id.toString(),
    nome: cliente.nome,
    telefone: cliente.telefone,
    email: cliente.email,
    endereco: cliente.endereco
  }));

  return { ok: true, clientes: resultados };
}

// Atualiza o Cliente
export async function atualizarCliente(oldCliente: Cliente, cliente: DadosCliente): Promise<ResultadoCriacao> {
  const colecao = await colecaoClientes();

  // Verifica se o ID é válido
  if (!ObjectId.isValid(oldCliente.id)) {
    return { ok: false };
  }

  // Atualiza por id
  const resultado = await colecao.updateOne(
    { _id: new ObjectId(oldCliente.id) },
    { $set: cliente }
  );

  // Retorna um boolean que indica se o Cliente foi encontrado
  return { ok: resultado.matchedCount === 1}
}

// Adiciona vários clientes ao mesmo tempo
export async function adicionarMultiplosClientes(clientes: DadosCliente[]) {
  const colecao = await colecaoClientes();

  const resultado = await colecao.insertMany(clientes);

  return {
    ok: true,
    quantidade: resultado.insertedCount
  };
}