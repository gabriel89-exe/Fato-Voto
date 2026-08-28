import Link from "next/link";
import { IconeInfo, IconeSeta } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Comparar candidatos" };

/** Comparador — entra no passo 6. */
export default function PaginaComparar() {
  return (
    <div className="envelope py-8 sm:py-12">
      <article className="entrada mx-auto max-w-leitura">
        <p className="border-b border-tinta-200 pb-3 text-sm text-tinta-600">
          <span>Caderno em preparação</span>
        </p>

        <h1 className="mt-6">Comparar candidatos</h1>

        <p className="mt-5 text-lg text-tinta-800">
          Aqui será possível colocar de 2 a 3 candidaturas do mesmo cargo lado a
          lado, com as mesmas informações na mesma ordem.
        </p>

        <Alert className="mt-6">
          <IconeInfo />
          <AlertTitle>Ainda não construído</AlertTitle>
          <AlertDescription>
            O comparador é o passo 6 do plano de execução. Os controles que ele
            vai usar — diálogo de seleção, caixas de marcação e tabela
            comparativa — já existem no{" "}
            <Link href="/interface">kit de interface</Link>.
          </AlertDescription>
        </Alert>

        <div className="mt-7">
          <Button asChild>
            <Link href="/candidatos">
              Ver a lista de candidatos
              <IconeSeta />
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
