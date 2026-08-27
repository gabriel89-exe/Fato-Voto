import Link from "next/link";

export const metadata = { title: "Comparar candidatos" };

/** Comparador — entra no passo 6. */
export default function PaginaComparar() {
  return (
    <div className="envelope py-8">
      <div className="mx-auto max-w-2xl">
        <h1>Comparar candidatos</h1>
        <p className="mt-3 text-tinta-700">
          Aqui será possível colocar de 2 a 3 candidaturas do mesmo cargo lado a
          lado, com as mesmas informações na mesma ordem.
        </p>
        <p
          role="status"
          className="mt-5 rounded-md border border-tinta-300 bg-superficie-baixa px-4 py-3 text-sm text-tinta-700"
        >
          <strong>Ainda não construído.</strong> O comparador é o passo 6 do
          plano de execução.
        </p>
        <p className="mt-5">
          <Link href="/candidatos" className="botao-secundario">
            Ver a lista de candidatos
          </Link>
        </p>
      </div>
    </div>
  );
}
