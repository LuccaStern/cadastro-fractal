export type Cliente = {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    endereco: string;
}

export type DadosCliente = Omit<Cliente, "id">;