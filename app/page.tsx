'use client'

import { Cliente } from "../types/cliente";
import NewClient from "@/components/NewClient";
import { useRef, useEffect, useState } from "react";
import { listaClientes, type EstadoCadastro } from "@/app/action";

export default function Home() {

  const atributosClientes = [
    { label: "Nome", name: "nome", type: "text" },
    { label: "Telefone", name: "telefone", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Endereço", name: "endereco", type: "text" }
  ];

  // Mensagens que aparecem caso não haja lista de clientes
  const errorMsgListaCliente = {
    loading: "Carregando clientes...",
    listaVazia: "Nenhum cliente cadastrado.",
    notFound: "Cliente não encontrado."
  }

  // Lista dos clientes
  const [clientes, setClientes] = useState<Cliente[] | null>(null);
  // Guarda o cliente selecionado que poderá ser editado
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  // Qual das mensagens aparece
  const [semClientesMensagem, setSemClientesMensagem] = useState<string>(errorMsgListaCliente.loading);

  // Estados para controlar a busca e o formulário de novo cliente
  const [searchTerm, setSearchTerm] = useState("");
  // Guarda os Clientes filtrados pelo SearchTerm
  const [filteredClientes, setFilteredClientes] = useState<Cliente[] | null>(null);
  // Diz se o modal de adicionar clientes deve ser renderizado ou não
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  // Referência para o input de busca
  const searchRef = useRef<HTMLInputElement>(null);

  // Realiza a consulta ao MongoDB
  function listarClientes() {
    setSemClientesMensagem(errorMsgListaCliente.loading)
    listaClientes().then((resultado) => {
      if (resultado.sucesso) {
        setClientes(resultado.clientes);
        if (resultado.clientes.length === 0) {
          setSemClientesMensagem(errorMsgListaCliente.listaVazia);
        } else {
          setSemClientesMensagem(errorMsgListaCliente.notFound);
        }
      } else {
        setSemClientesMensagem(resultado.mensagem);
      }
    });
  }

  useEffect(() => {
    
    // Chama a consulta ao MongoDB
    listarClientes()

    const searchInput = searchRef.current;
    if (!searchInput) return;
    
    // Sempre que o input de busca mudar, atualiza o estado searchTerm
    searchInput.addEventListener("input", () => {
      setSearchTerm(searchInput.value);
    });
  }, []);

  // Sempre que searchTerm mudar, atualiza a lista de clientes filtrados
  useEffect(() => {
    setFilteredClientes(
      clientes?.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
      ) || null
    );
  }, [searchTerm, clientes]);

  return (
    <main className="w-screen h-screen flex flex-row justify-center items-center bg-black">
      {/*
        Imagens e design retirados da página de login da Fractal Security,
        disponível em: https://i-monitor.fractal-security.com/auth/login
      */}
      <img src="/logo-topo-esquerdo-6e425db8.svg" alt="Logo-Topo-Esquerdo" className="absolute -top-64 left-0 w-[30rem] h-w-[30rem]"/>
      <img src="/logo-baixo-direito-a7cfd62d.svg" alt="Logo-Baixo-Direito" className="absolute bottom-0 right-0 w-120 h-w-[30rem]"/>
      
      {/* Formulário de Novo Cliente (Modal)*/}
      { showNewClientForm && (
        <NewClient
          atributosClientes={atributosClientes}
          setShowNewClientForm={setShowNewClientForm}
          cliente={clienteSelecionado}
          setCliente={setClienteSelecionado}
          listarClientes={listarClientes}/>
      )}
    
      {/* Container da tabela de clientes*/}
      <div className={`text-white bg-[#003839] border-2 border-black rounded
        flex flex-col justify-start items-center
        max-w-screen sm:w-screen md:w-[80vw]
        h-screen max-h-screen sm:h-screen md:h-fit
        z-10  p-8 ${showNewClientForm ? "blur-sm select-none pointer-events-none" : ""}`}>
        
        {/* Cabeçalho do container */}
        <div className="mb-4 w-full flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-row gap-3 w-full">
            <h1 className="text-2xl font-bold">Clientes</h1>

            {/* Campo de busca para filtrar os clientes por nome */}
            <input ref={searchRef} type="text" disabled={showNewClientForm} placeholder="Buscar por nome..." className="w-full p-2 bg-[#ffffff1d] rounded font-bold placeholder:font-thin text-start"/>
          </div>
          <div className="flex flex-row gap-3">
            {/* Botão para abrir o formulário de adicionar novo cliente */}
            <button className={`bg-[#05ff00] ${showNewClientForm ? "" : "hover:scale-105 "}transition text-[#003839] font-bold py-2 px-4 rounded w-fit md:text-nowrap sm:text-wrap ${showNewClientForm ? "cursor-default" : "cursor-pointer"}`}
              onClick={() => setShowNewClientForm(true)}>
              { clienteSelecionado ? 'Editar Cliente' : '+ Novo Cliente' }
            </button>
            <button className={`bg-[#05ff00] ${showNewClientForm ? "" : "hover:scale-105 "}transition text-[#003839] font-bold py-2 px-4 rounded w-fit md:text-nowrap sm:text-wrap ${showNewClientForm ? "cursor-default" : "cursor-pointer"}`}
              onClick={() => setShowNewClientForm(true)}>
              Importar Clientes
            </button>
          </div>
        </div>
        
        {/* Área da tabela de clientes */}
        <div className="overflow-y-auto max-h-full h-full md:h-96 w-full">
          
          {/* Caso não haja clientes, uma mensagem aparece */}
          { ( filteredClientes === null || filteredClientes?.length === 0 ) ? (
            <div className="flex justify-center items-center h-full w-full">
              <p className="text-white text-3xl text-center">{semClientesMensagem}</p>
            </div>
          ) : (
            /* Tabela de clientes */
            <table className="w-full border-separate border-spacing-0 border border-white">
              <thead className="bg-[#003839] sticky top-0">
                <tr>
                  { atributosClientes.map(({label}, index) => (
                    <th className="border border-white p-2" key={index}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                { filteredClientes?.map((cliente, index) => (
                  <tr key={index} className={`cursor-pointer ${clienteSelecionado === cliente ? "bg-[#05ff00] text-[#003839]" : ""}`} onClick={() => {
                      if (cliente === clienteSelecionado) {
                        // Se já selecionado, desseleciona
                        setClienteSelecionado(null);
                      } else {
                        // Se não está selecionado, seleciona
                        setClienteSelecionado(cliente);
                      }}
                    }>
                    { atributosClientes.map(({label}, index) => (
                      <td className="border border-white p-2" key={index}>{cliente[label.toLowerCase().replace('ç', 'c') as keyof Cliente]}</td>
                    )) }
                  </tr>
                )) }
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
