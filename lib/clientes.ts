import "server-only"; // Impede que seja executado no cliente, impedindo que a URI e o driver cheguem ao navegador
import { getDb } from "@/lib/mongodb";
import type { Cliente } from "@/types/cliente";

async function colecaoClientes() {
  const db = await getDb();
  return db.collection<Cliente>("clientes");
}

export type ResultadoCriacao = { ok: true };

export async function criarCliente(cliente: Cliente): Promise<ResultadoCriacao> {
  const colecao = await colecaoClientes();

    await colecao.insertOne(cliente);
    return { ok: true };
}