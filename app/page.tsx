'use client'

import { Cliente } from "../types/cliente";
import NewClient from "@/components/NewClient";
import { useRef, useEffect, useState } from "react";

export default function Home() {

  const atributosClientes = [
    { label: "Nome", name: "nome", type: "text" },
    { label: "Telefone", name: "telefone", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Endereço", name: "endereco", type: "text" }
  ];
  // Placeholder de clientes, para fins de teste
  const clientes: Cliente[] = [
    { nome: "Maria Joana da Silva",
      telefone: "+55 (12) 99999-9999",
      email: "mariazinha173@gmail.com",
      endereco: "R. Navegantes 84"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    },
    { nome: "João da Silva",
      telefone: "+55 (11) 91234-5678",
      email: "joao.silva@email.com",
      endereco: "R. João da Silva 123"
    }
  ];

  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  // Estados para controlar a busca e o formulário de novo cliente
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>(clientes);
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  // Referência para o input de busca
  const searchRef = useRef<HTMLInputElement>(null);

  // Sempre que o input de busca mudar, atualiza o estado searchTerm
  useEffect(() => {
    const searchInput = searchRef.current;
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
      setSearchTerm(searchInput.value);
    });
  }, []);

  // Sempre que searchTerm mudar, atualiza a lista de clientes filtrados
  useEffect(() => {
    setFilteredClientes(
      clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

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
        <NewClient atributosClientes={atributosClientes} setShowNewClientForm={setShowNewClientForm} cliente={clienteSelecionado} />
      )}
    
      {/* Container da tabela de clientes*/}
      <div className={`text-white bg-[#003839] border-2 border-black flex flex-col rounded w-[80vw] h-fit max-h-screen z-10 justify-center items-center p-8 ${showNewClientForm ? "blur-sm select-none pointer-events-none" : ""}`}>
        
        {/* Cabeçalho do container */}
        <div className="mb-4 w-full flex flex-row justify-between items-center gap-3">
          <h1 className="text-2xl font-bold">Clientes</h1>

          {/* Campo de busca para filtrar os clientes por nome */}
          <input ref={searchRef} type="text" disabled={showNewClientForm} placeholder="Buscar por nome..." className="w-full p-2 bg-[#ffffff1d] rounded font-bold placeholder:font-thin text-start"/>
          
          {/* Botão para abrir o formulário de adicionar novo cliente */}
          <button className={`bg-[#05ff00] ${showNewClientForm ? "" : "hover:scale-105 "}transition text-[#003839] font-bold py-2 px-4 rounded w-fit md:text-nowrap sm:text-wrap ${showNewClientForm ? "cursor-default" : "cursor-pointer"}`}
            onClick={() => setShowNewClientForm(true)}>
            { clienteSelecionado ? 'Editar Cliente' : '+ Novo Cliente' }
          </button>
        </div>
        
        {/* Área da tabela de clientes */}
        <div className="overflow-y-auto h-96 w-full">
          
          {/* Caso não haja clientes, uma mensagem aparece */}
          { filteredClientes.length === 0 ? (
            <div className="flex justify-center items-center h-full w-full">
              <p className="text-white text-3xl text-center">Nenhum cliente encontrado</p>
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
                { filteredClientes.map((cliente, index) => (
                  <tr key={index}  className={`cursor-pointer ${clienteSelecionado === cliente ? "bg-[#05ff00] text-[#003839]" : ""}`} onClick={() => {
                      if (cliente === clienteSelecionado) {
                        setClienteSelecionado(null);
                      } else {
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
