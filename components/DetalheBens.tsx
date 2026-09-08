import DadoOficial from "@/components/DadoOficial";
import { GraficoComposicao } from "@/components/graficos";
import {
  Table,
  TableBody,
  TableCell,
  TableCellNumero,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reais } from "@/lib/formato";
import type { Bem } from "@/types";

/**
 * Bens declarados, item a item.
 *
 * Saiu da aba própria e passou a viver dentro de <ResumoPatrimonio>,
 * que só o monta quando alguém pede. O motivo é duplicação: o topo da
 * ficha já mostrava total, quantidade e denominador, e a aba repetia os
 * mesmos números uma tela abaixo. Dois lugares com o mesmo dado é um
 * lugar a mais para divergir.
 *
 * Não tem estado nem efeito — é só marcação — então serve tanto ao
 * servidor quanto ao componente cliente que o monta sob demanda.
 */
export default function DetalheBens({
  bens,
  nome,
  fonte,
  coletadoEm,
  urlOriginal,
}: {
  bens: Bem[];
  nome: string;
  fonte: string;
  coletadoEm: string;
  urlOriginal: string;
}) {
  /* Ordem por valor, com desempate estável pela ordem da fonte. */
  const ordenados = [...bens].sort(
    (a, b) => b.valor - a.valor || a.ordem - b.ordem,
  );

  return (
    <DadoOficial
      titulo="Bens declarados no registro"
      fonte={fonte}
      coletadoEm={coletadoEm}
      urlOriginal={urlOriginal}
    >
      <GraficoComposicao
        legenda={`Composição dos bens declarados por ${nome}`}
        itens={ordenados.map((b) => ({ rotulo: b.tipo, valor: b.valor }))}
      />

      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenados.map((b) => (
              <TableRow key={b.ordem}>
                {/* Sem rótulo: no celular o tipo abre a ficha. */}
                <TableCell>{b.tipo}</TableCell>
                <TableCell rotulo="Descrição" larga>
                  {b.descricao}
                </TableCell>
                <TableCellNumero rotulo="Valor">
                  {reais(b.valor)}
                </TableCellNumero>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DadoOficial>
  );
}
