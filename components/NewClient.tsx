"use client"

import { useActionState } from "react";
import { useEffect } from "react";
import { cadastrarCliente, type EstadoCadastro } from "@/app/action";
import { Cliente } from "@/types/cliente";

export default function Home(props: {
    atributosClientes: { label: string; name: string; type: string }[]
    setShowNewClientForm: React.Dispatch<React.SetStateAction<boolean>>
    cliente: Cliente | null
}) {

    const estadoInicial: EstadoCadastro = { sucesso: false, mensagem: "" };

    const [estado, formAction, pendente] = useActionState(cadastrarCliente, estadoInicial);

    // Fecha o formulário quando o cadastro é bem-sucedido
    useEffect(() => {
        if (estado.sucesso) {
            props.setShowNewClientForm(false);
        }
    }, [estado.sucesso, props.setShowNewClientForm]);

    return (
        /* Formulário de cadastro de cliente */
        <form className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50
        text-white bg-[#003839] border-2 border-black
        flex flex-col justify-center items-center rounded
        w-96 min-h-fit max-h-fit p-8" action={formAction}>

            {/* Botão para fechar o formulário */}
            <button type="button" className="absolute top-4 right-4 text-[red] font-bold scale-125 transition cursor-pointer hover:scale-150"
                onClick={() => props.setShowNewClientForm(false)}>
                {/* Ícone "Close" importado de Material Symbols Outlined da Google */}
                <span className="material-symbols-outlined">
                    close
                </span>
            </button>
            <div className="mb-4 w-full">
                <h1 className="text-2xl font-bold">Cadastro de Cliente</h1>
            </div>
            { props.atributosClientes.map(({label, name, type}, index) => (
                <div className="mb-4 w-full" key={index}>
                    <label htmlFor={name} className="font-semibold mb-1">{label}</label>
                    <input className="w-full p-2 bg-[#ffffff1d] rounded font-bold placeholder:font-thin text-start"
                        placeholder={label} type={type} id={name} name={name}
                        defaultValue={props.cliente ? props.cliente[name as keyof Cliente] : ''}
                        required/>
                    {(estado.erros?.[name as keyof Cliente] && !pendente) && (
                        <p className="text-red-300 text-sm mt-1">{estado.erros[name as keyof Cliente]}</p>
                    )}
                </div>
            ))}
            <button type="submit" disabled={pendente} className="bg-[#05ff00] hover:scale-105 transition text-[#003839] font-bold py-2 px-4 rounded w-full cursor-pointer">
                {props.cliente ? 'Atualizar' : 'Cadastrar'}
            </button>
        </form>
    )
}