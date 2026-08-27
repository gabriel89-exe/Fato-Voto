import Link from "next/link";
import { IconeInfo, IconeSeta } from "@/components/icones";

export const metadata = { title: "Comparar candidatos" };

/** Comparador — entra no passo 6. */
export default function PaginaComparar() {
  return (
    <div className="envelope py-8 sm:py-12">
      <div className="entrada mx-auto max-w-2xl">
        <span className="chip">Comparador</span>

        <h1 className="mt-3">Comparar candidatos</h1>

        <p className="mt-4 text-lg text-tinta-700">
          Aqui será possível colocar de 2 a 3 candidaturas do mesmo cargo lado a
          lado, com as mesmas informações na mesma ordem.
        </p>

        <div role="status" className="aviso-callout mt-5 flex gap-3">
          <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
          <span>
            <strong className="font-semibold text-tinta-900">
              Ainda não construído.
            </strong>{" "}
            O comparador é o passo 6 do plano de execução.
          </span>
        </div>

        <p className="mt-6">
          <Link href="/candidatos" className="botao-secundario">
            Ver a lista de candidatos
            <IconeSeta />
          </Link>
        </p>
      </div>
    </div>
  );
}
