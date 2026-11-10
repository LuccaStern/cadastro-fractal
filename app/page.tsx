'use client'

import { Cliente, DadosCliente } from "../types/cliente";
import NewClient from "@/components/NewClient";
import { useRef, useEffect, useState } from "react";
import Papa from "papaparse";
import { listaClientes, importarClientes, type EstadoCadastro } from "@/app/action";

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
  // Referência para o input do CSV
  const importCSVRef = useRef<HTMLInputElement>(null);
  // Guarda a resposta da importação do CSV
  const [respostaCSV, setRespostaCSV] = useState(null as EstadoCadastro | null)

  // Abre o seletor do input do CSV
  function abrirSeletor() {
    importCSVRef.current?.click();
  }

  // Lê o CSV e já limpa alguns campos vazios
  function lerCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    Papa.parse<Record<string, string>>(arquivo, {
      header: true,
      skipEmptyLines: "greedy",

      transformHeader: (header) => header.trim().toLowerCase().replace('ç', 'c'),

      complete: async (resultado) => {
        const clientesCSV: DadosCliente[] = resultado.data.map((linha) => ({
          // Transforma o nome em minúsculas, exceto as iniciais
          nome: linha.nome?.trim().toLocaleLowerCase().split(' ').map((nome) => {return [nome.substring(0,1).toUpperCase(), nome.substring(1)].join('')}).join(' ') || "Não Informado",
          telefone: linha.telefone?.trim() || "Não Informado",
          email: linha.email?.trim().toLowerCase() || "Não Informado",
          endereco: linha.endereco?.trim() || "Não Informado"
        }));

        const resposta = await importarClientes(clientesCSV);

        setRespostaCSV(resposta)

        listarClientes()
      }
    });

    event.target.value = "";
  }


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
              onClick={abrirSeletor}>
              Importar Clientes
            </button>
            {/* Input invisível para selecionar o CSV. É acionado ao clicar no botão acima */}
            <input
                ref={importCSVRef}
                type="file"
                accept=".csv,text/csv"
                style={{ display: "none" }}
                onChange={lerCSV}
            />
          </div>
        </div>

        {/* Área de resposta ao importar o CSV */}
        { respostaCSV &&
          <div className="flex flex-row flex-wrap justify-center items-center gap-2">
            <p className={`${ respostaCSV.sucesso ? 'text-white' : 'text-red-300'} text-sm mb-2`}>{respostaCSV.mensagem}</p>
            { respostaCSV.clientesInvalidos &&
              <a href="#invalid" className={`text-white underline text-sm mb-2`}>Veja os clientes inválidos aqui</a>
            }
          </div>
        }

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
                    { atributosClientes.map(({label}, index) => {
                      const item = cliente[label.toLowerCase().replace('ç', 'c') as keyof Cliente]
                      return (
                        <td className={`border border-white p-2${item === 'Não Informado' ? ' text-[#ff2525] font-bold': ''}`} key={index}>{item}</td>
                    )}) }
                  </tr>
                )) }
              </tbody>
            </table>
          )}

          {/* Área para tabela de clientes inválidos ao importar o CSV */}
          { respostaCSV?.clientesInvalidos && (
            <>
            <h1 id='invalid' className='text-2xl font-bold'>Clientes inválidos</h1>
            {/* Tabela de clientes INVÁLIDOS importados do CSV */}
            <table className="w-full border-separate border-spacing-0 border border-white">
              <thead className="bg-[#003839] sticky top-0">
                <tr>
                  { atributosClientes.map(({label}, index) => (
                    <th className="border border-white p-2" key={index}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                { respostaCSV.clientesInvalidos.map((cliente, index) => (
                  <tr key={index}>
                    { atributosClientes.map(({label}, index) => {
                      const item = cliente[label.toLowerCase().replace('ç', 'c') as keyof DadosCliente]
                      return (
                        <td className={`border border-white p-2${item === 'Não Informado' ? ' text-[#ff2525] font-bold': ''}`} key={index}>{item}</td>
                    )}) }
                  </tr>
                )) }
              </tbody>
            </table>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
