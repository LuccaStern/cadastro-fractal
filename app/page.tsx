import Image from "next/image";

export default function Home() {

  const atributosClientes = [{ label: "Nome", type: "text" }, { label: "Telefone", type: "text" }, { label: "Email", type: "email" }, { label: "Endereço", type: "text" }];

  return (
    <main className="w-screen h-screen flex flex-row justify-center items-center bg-black">
      {/*
        Imagens e design retirados da página de login da Fractal Security,
        disponível em: https://i-monitor.fractal-security.com/auth/login
      */}
      <img src="/logo-topo-esquerdo-6e425db8.svg" alt="Logo-Topo-Esquerdo" className="absolute -top-64 left-0 w-[30rem] h-w-[30rem]"/>
      <img src="/logo-baixo-direito-a7cfd62d.svg" alt="Logo-Baixo-Direito" className="absolute bottom-0 right-0 w-120 h-w-[30rem]"/>
      <form className="text-white bg-[#003839] flex flex-col rounded w-96 min-h-fit max-h-fit z-10 justify-center items-center p-8">
        <div className="mb-4 w-full">
          <h1 className="text-2xl font-bold">Cadastro de Cliente</h1>
        </div>
        { atributosClientes.map(({label, type}, index) => (
          <div className="mb-4 w-full" key={index}>
            <label htmlFor={label.toLowerCase()} className="font-semibold mb-1">{label}</label>
            <input className="w-full p-2 bg-[#ffffff1d] rounded font-bold placeholder:font-thin text-start" placeholder={label} type={type} id={label.toLowerCase()} name={label.toLowerCase()} required/>
          </div>
        ))}
        <button type="submit" className="bg-[#05ff00] hover:scale-105 transition text-[#003839] font-bold py-2 px-4 rounded w-full">Cadastrar</button>
      </form> 
    </main>
  );
}
