import Link from "next/link";
import { IconeInfo, IconeSeta } from "@/components/icones";

export const metadata = { title: "Comparar candidatos" };

/** Comparador — entra no passo 6. */
export default function PaginaComparar() {
  return (
    <>
      <section className="casca casca-planta">
        <div className="envelope entrada py-12 sm:py-16">
          <span className="chip">Comparador</span>
          <h1 className="mt-5 max-w-3xl text-casca-texto">
            Comparar candidatos
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-casca-suave">
            Aqui será possível colocar de 2 a 3 candidaturas do mesmo cargo lado
            a lado, com as mesmas informações na mesma ordem.
          </p>
        </div>
      </section>

      <div className="envelope py-10 sm:py-14">
        <div className="mx-auto max-w-leitura">
          <div role="status" className="aviso-callout flex gap-3">
            <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
            <span>
              <strong className="font-semibold text-tinta-900">
                Ainda não construído.
              </strong>{" "}
              O comparador é o passo 6 do plano de execução.
            </span>
          </div>

          <p className="mt-6">
            <Link href="/candidatos" className="botao-primario">
              Ver a lista de candidatos
              <IconeSeta />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
