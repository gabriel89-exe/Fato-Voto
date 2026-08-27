import Link from "next/link";
import { IconeInfo, IconeSeta } from "@/components/icones";

export const metadata = { title: "Comparar candidatos" };

/** Comparador — entra no passo 6. */
export default function PaginaComparar() {
  return (
    <div className="envelope py-8 sm:py-12">
      <article className="entrada mx-auto max-w-leitura">
        <p className="folio border-y-2 border-tinta-900 py-2">
          <span>Caderno em preparação</span>
        </p>

        <h1 className="mt-6">Comparar candidatos</h1>

        <p className="mt-5 font-display text-xl font-medium leading-[1.2] tracking-[-0.02em] text-tinta-800">
          Aqui será possível colocar de 2 a 3 candidaturas do mesmo cargo lado a
          lado, com as mesmas informações na mesma ordem.
        </p>

        <div role="status" className="aviso-callout mt-6 flex gap-3">
          <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
          <span>
            <strong className="font-bold text-tinta-900">
              Ainda não construído.
            </strong>{" "}
            O comparador é o passo 6 do plano de execução.
          </span>
        </div>

        <p className="mt-7">
          <Link href="/candidatos" className="botao-primario">
            Ver a lista de candidatos
            <IconeSeta />
          </Link>
        </p>
      </article>
    </div>
  );
}
