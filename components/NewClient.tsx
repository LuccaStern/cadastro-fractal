export default function Home(props: {
    atributosClientes: { label: string; type: string }[]
    setShowNewClientForm: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        /* Formulário de cadastro de cliente */
        <form className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50
        text-white bg-[#003839] border-2 border-black
        flex flex-col justify-center items-center rounded
        w-96 min-h-fit max-h-fit p-8">

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
            { props.atributosClientes.map(({label, type}, index) => (
                <div className="mb-4 w-full" key={index}>
                    <label htmlFor={label.toLowerCase()} className="font-semibold mb-1">{label}</label>
                    <input className="w-full p-2 bg-[#ffffff1d] rounded font-bold placeholder:font-thin text-start" placeholder={label} type={type} id={label.toLowerCase()} name={label.toLowerCase()} required/>
                </div>
            ))}
            <button type="submit" className="bg-[#05ff00] hover:scale-105 transition text-[#003839] font-bold py-2 px-4 rounded w-full cursor-pointer">Cadastrar</button>
        </form>
    )
}