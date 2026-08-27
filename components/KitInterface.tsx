"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCellNumero,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconeBusca, IconeFiltro, IconeSeta } from "@/components/icones";
import { candidatos, partidos } from "@/lib/dados";
import { reais } from "@/lib/formato";

/**
 * Kit de interface — a vitrine viva dos componentes de components/ui.
 *
 * Nao e pagina de produto: e onde se confere, num relance, que todo
 * controle do site fala a mesma lingua visual e obedece as regras de
 * neutralidade. Quem for construir os passos 3 a 6 comeca por aqui.
 */

/** Cabecalho de secao numerada, no padrao das demais paginas. */
function Secao({
  folio,
  titulo,
  nota,
  children,
}: {
  folio: string;
  titulo: string;
  nota?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 scroll-mt-32" id={`s-${folio}`}>
      <div className="secao-cabeca">
        <span className="folio">
          <b>§ {folio}</b>
        </span>
        <h2>{titulo}</h2>
      </div>
      {nota ? <p className="mt-3 max-w-leitura text-sm text-tinta-600">{nota}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Moldura de exemplo, com o nome do componente em cima. */
function Amostra({
  nome,
  children,
  className = "",
}: {
  nome: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // `min-w-0` nao e enfeite: item de grid tem `min-width: auto` e se
    // recusa a encolher abaixo do proprio conteudo. Sem isto, a regua de
    // abas (que rola sozinha) empurra a moldura para fora da tela e a
    // PAGINA passa a rolar de lado em 360px.
    <div className="min-w-0 border-2 border-tinta-900 bg-papel">
      <p className="border-b border-tinta-300 bg-papel-alta px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-tinta-500">
        {nome}
      </p>
      <div className={`min-w-0 p-5 ${className}`}>{children}</div>
    </div>
  );
}

export default function KitInterface() {
  const [ordem, setOrdem] = useState("sorteada");
  const [cargo, setCargo] = useState("todos");
  const [marcados, setMarcados] = useState<string[]>([partidos[0].id]);
  const [corrigido, setCorrigido] = useState(false);

  const alternar = (id: string) =>
    setMarcados((atual) =>
      atual.includes(id)
        ? atual.filter((outro) => outro !== id)
        : [...atual, id],
    );

  // Amostra pequena e estavel dos dados ficticios, so para os exemplos.
  const amostra = candidatos.slice(0, 4);
  const tresPartidos = partidos.slice(0, 3);

  return (
    <>
      <Toaster />

      {/* ================= § 01 — Botoes ================= */}
      <Secao
        folio="01"
        titulo="Botões"
        nota="Quatro pesos de ação e um link de texto. O botão levanta 2px na diagonal no hover e afunda no clique — é a única “profundidade” do sistema, e ela é dura, sem desfoque."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Amostra nome="variant" className="flex flex-wrap items-center gap-3">
            <Button>Primário</Button>
            <Button variant="secundario">Secundário</Button>
            <Button variant="fantasma">Fantasma</Button>
            <Button variant="destrutivo">Destrutivo</Button>
            <Button variant="elo">Elo de texto</Button>
          </Amostra>

          <Amostra nome="size" className="flex flex-wrap items-center gap-3">
            <Button size="sm">Pequeno</Button>
            <Button size="md">Médio</Button>
            <Button size="lg">Grande</Button>
            <Button size="icone" aria-label="Buscar">
              <IconeBusca />
            </Button>
          </Amostra>

          <Amostra nome="asChild + next/link" className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/candidatos">
                Lista completa
                <IconeSeta />
              </Link>
            </Button>
            <Button asChild variant="secundario">
              <Link href="/metodologia">Metodologia</Link>
            </Button>
          </Amostra>

          <Amostra nome="disabled" className="flex flex-wrap gap-3">
            <Button disabled>Indisponível</Button>
            <Button variant="secundario" disabled>
              Indisponível
            </Button>
          </Amostra>
        </div>

        <Alert variant="neutro" className="mt-5">
          <AlertTitle>Sem vermelho, de propósito</AlertTitle>
          <AlertDescription>
            A variante <code className="font-mono">destrutivo</code> se
            distingue pela moldura dupla e pelo texto, nunca pela cor. Neste
            site nenhum matiz pode ser lido como juízo de valor — a regra vale
            para a interface inteira, não só para as fichas.
          </AlertDescription>
        </Alert>
      </Secao>

      {/* ================= § 02 — Campos ================= */}
      <Secao
        folio="02"
        titulo="Campos de formulário"
        nota="Todos com 46px de altura mínima, moldura de tinta e sombra interna de prensa. Caixa de marcação e escolha única são quadradas: o que separa “escolha várias” de “escolha uma” é o miolo, não o formato."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Amostra nome="Input + Label" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kit-busca">Nome ou número de urna</Label>
              <Input id="kit-busca" placeholder="Amanda, goncalves, 24…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kit-texto">Observação</Label>
              <Textarea id="kit-texto" rows={3} placeholder="Texto livre…" />
            </div>
          </Amostra>

          <Amostra nome="Checkbox — recorte por partido" className="space-y-1">
            {tresPartidos.map((partido) => (
              <label
                key={partido.id}
                className="flex min-h-toque cursor-pointer items-center gap-3 px-1 text-sm text-tinta-800"
              >
                <Checkbox
                  checked={marcados.includes(partido.id)}
                  onCheckedChange={() => alternar(partido.id)}
                />
                <span>
                  <span className="font-semibold">{partido.sigla}</span>{" "}
                  <span className="text-tinta-500">— {partido.nome}</span>
                </span>
              </label>
            ))}
            <p className="pt-2 font-mono text-[0.68rem] uppercase tracking-[0.13em] text-tinta-500">
              {marcados.length} de {tresPartidos.length} marcados
            </p>
          </Amostra>

          <Amostra nome="RadioGroup — ordem da lista">
            <RadioGroup value={ordem} onValueChange={setOrdem}>
              {[
                ["sorteada", "Sorteada (padrão)"],
                ["nome", "Nome"],
                ["numero", "Número de urna"],
              ].map(([valor, rotulo]) => (
                <label
                  key={valor}
                  className="flex min-h-toque cursor-pointer items-center gap-3 px-1 text-sm text-tinta-800"
                >
                  <RadioGroupItem value={valor} />
                  {rotulo}
                </label>
              ))}
            </RadioGroup>
            <p className="mt-2 text-xs text-tinta-600">
              A ordem sorteada é o padrão do site e não deve deixar de ser.
            </p>
          </Amostra>

          <Amostra nome="Switch — preferência de exibição">
            <label className="flex min-h-toque cursor-pointer items-center justify-between gap-4">
              <span className="text-sm text-tinta-800">
                Corrigir valores pela inflação
              </span>
              <Switch checked={corrigido} onCheckedChange={setCorrigido} />
            </label>
            <p className="mt-2 text-xs text-tinta-600">
              Estado atual: {corrigido ? "corrigido" : "valor nominal"}.
            </p>
          </Amostra>
        </div>
      </Secao>

      {/* ================= § 03 — Etiquetas e filetes ================= */}
      <Secao
        folio="03"
        titulo="Etiquetas e filetes"
        nota="A etiqueta identifica a natureza do bloco (oficial ou escrito por nós). Nunca use etiqueta para marcar candidatura, partido ou situação de registro."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Amostra nome="Badge" className="flex flex-wrap items-center gap-2">
            <Badge>Contorno</Badge>
            <Badge variant="solido">Sólido</Badge>
            <Badge variant="discreto">Discreto</Badge>
            <Badge variant="oficial">Dado oficial</Badge>
            <Badge variant="plataforma">Escrito por nós</Badge>
          </Amostra>

          <Amostra nome="Separator" className="space-y-3">
            <p className="rotulo-meta">Filete grosso — separa seções</p>
            <Separator peso="grossa" />
            <p className="rotulo-meta">Filete fino — separa itens</p>
            <Separator />
            <div className="flex h-10 items-center gap-4">
              <span className="text-sm">Vertical</span>
              <Separator orientation="vertical" peso="grossa" />
              <span className="text-sm">grosso</span>
              <Separator orientation="vertical" />
              <span className="text-sm">fino</span>
            </div>
          </Amostra>
        </div>
      </Secao>

      {/* ================= § 04 — Avisos ================= */}
      <Secao
        folio="04"
        titulo="Avisos"
        nota="As três variantes existem para separar quem está falando — a interface, o órgão de origem, ou esta plataforma. É a mesma lógica do par DadoOficial / ResumoPlataforma, em escala menor."
      >
        <div className="space-y-4">
          <Alert variant="neutro">
            <AlertTitle>Página provisória</AlertTitle>
            <AlertDescription>
              A busca instantânea, os filtros e a ordenação sorteada ainda serão
              construídos.
            </AlertDescription>
          </Alert>

          <Alert variant="oficial">
            <AlertTitle>Situação do registro: sub judice</AlertTitle>
            <AlertDescription>
              O registro está em análise na Justiça. Enquanto não há decisão
              final, o nome pode continuar na urna.
            </AlertDescription>
          </Alert>

          <Alert variant="plataforma">
            <AlertTitle>Resumo desta plataforma</AlertTitle>
            <AlertDescription>
              Texto produzido por esta plataforma, não pela candidatura. Não
              substitui a leitura do documento oficial.
            </AlertDescription>
          </Alert>
        </div>
      </Secao>

      {/* ================= § 05 — Blocos ================= */}
      <Secao
        folio="05"
        titulo="Blocos de papel"
        nota="O Card é a moldura padrão. Não existe (e não deve passar a existir) uma variante de destaque: dar moldura diferente a uma candidatura é recomendação disfarçada."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Documento entregue no registro</CardTitle>
              <CardDescription>Proposta de governo, 32 páginas</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-tinta-700">
              O conteúdo do bloco. Repare que a moldura é idêntica à do bloco ao
              lado — a diferença está apenas no que está escrito.
            </CardContent>
            <CardFooter>
              <Badge variant="oficial">Dado oficial</Badge>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verbete de candidatura</CardTitle>
              <CardDescription>Mesma moldura, mesmo peso</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-tinta-700">
              Toda ficha da lista sai com esta moldura, sem exceção: mesma
              borda, mesma sombra, mesmo tamanho.
            </CardContent>
            <CardFooter>
              <Button asChild variant="secundario" size="sm">
                <Link href="/candidatos">Ver a lista</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Secao>

      {/* ================= § 06 — Camadas ================= */}
      <Secao
        folio="06"
        titulo="Abas e sanfonas"
        nota="Abas para as seções de uma mesma ficha (passo 5). Sanfona para grupos de filtro e para perguntas longas."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Amostra nome="Tabs">
            <Tabs defaultValue="perfil">
              <TabsList>
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="proposta">Proposta</TabsTrigger>
                <TabsTrigger value="mandato">Mandato</TabsTrigger>
                <TabsTrigger value="bens">Bens</TabsTrigger>
              </TabsList>
              <TabsContent value="perfil" className="text-sm text-tinta-700">
                Dados declarados no registro: idade, gênero, cor ou raça,
                escolaridade e ocupação.
              </TabsContent>
              <TabsContent value="proposta" className="text-sm text-tinta-700">
                Resumo em linguagem simples ao lado do documento oficial, com o
                mesmo destaque.
              </TabsContent>
              <TabsContent value="mandato" className="text-sm text-tinta-700">
                Votações nominais, presença e proposições — quando a pessoa já
                exerceu mandato.
              </TabsContent>
              <TabsContent value="bens" className="text-sm text-tinta-700">
                Bens declarados por ordem de valor e a evolução do total
                declarado.
              </TabsContent>
            </Tabs>
          </Amostra>

          <Amostra nome="Accordion — grupos de filtro">
            <Accordion type="multiple" defaultValue={["cargo"]}>
              <AccordionItem value="cargo">
                <AccordionTrigger>Cargo</AccordionTrigger>
                <AccordionContent>
                  Governador e Senador. O cargo muda quais campos fazem sentido
                  comparar.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="registro">
                <AccordionTrigger>Situação do registro</AccordionTrigger>
                <AccordionContent>
                  Deferido, deferido com recurso, sub judice, indeferido. Todos
                  aparecem na lista.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="perfil">
                <AccordionTrigger>Perfil declarado</AccordionTrigger>
                <AccordionContent>
                  Faixa etária, gênero, cor ou raça e escolaridade, como
                  declarados no registro.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Amostra>
        </div>
      </Secao>

      {/* ================= § 07 — Sobreposicoes ================= */}
      <Secao
        folio="07"
        titulo="Sobreposições"
        nota="Gaveta para os filtros no celular; caixa de diálogo para uma decisão; balão para conteúdo interativo curto; nota flutuante apenas como reforço, nunca como única via."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Amostra nome="Sheet — filtros no celular">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secundario">
                  <IconeFiltro />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filtrar candidaturas</SheetTitle>
                  <SheetDescription>
                    Os recortes valem para a lista inteira.
                  </SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <Accordion type="multiple" defaultValue={["partido"]}>
                    <AccordionItem value="partido">
                      <AccordionTrigger>Partido</AccordionTrigger>
                      <AccordionContent className="space-y-1">
                        {tresPartidos.map((partido) => (
                          <label
                            key={partido.id}
                            className="flex min-h-toque cursor-pointer items-center gap-3 text-sm"
                          >
                            <Checkbox />
                            {partido.sigla}
                          </label>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="reeleicao">
                      <AccordionTrigger>Reeleição</AccordionTrigger>
                      <AccordionContent className="space-y-1">
                        <label className="flex min-h-toque cursor-pointer items-center gap-3 text-sm">
                          <Checkbox />
                          Disputa reeleição
                        </label>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </SheetBody>
                <SheetFooter>
                  <Button>Aplicar</Button>
                  <Button variant="fantasma">Limpar tudo</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </Amostra>

          <Amostra nome="Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secundario">Adicionar à comparação</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Comparar candidaturas</DialogTitle>
                  <DialogDescription>
                    De 2 a 3 candidaturas do mesmo cargo, lado a lado, com as
                    mesmas informações na mesma ordem.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-1 px-5 py-4">
                  {amostra.map((c) => (
                    <label
                      key={c.id}
                      className="flex min-h-toque cursor-pointer items-center gap-3 text-sm text-tinta-800"
                    >
                      <Checkbox />
                      <span className="font-mono tabular-nums text-tinta-500">
                        {c.numero}
                      </span>
                      {c.nomeUrna}
                    </label>
                  ))}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="fantasma">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button>Comparar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Amostra>

          <Amostra nome="Popover">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secundario">O que é sub judice?</Button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-sm text-tinta-700">
                  O registro ainda está em análise na Justiça. Enquanto não há
                  decisão final, o nome pode continuar na urna.
                </p>
              </PopoverContent>
            </Popover>
          </Amostra>

          <Amostra nome="DropdownMenu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secundario">Ações da ficha</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Esta ficha</DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={() => toast("Link da ficha copiado")}
                >
                  Copiar link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => toast("Download começaria aqui")}
                >
                  Baixar os dados (JSON)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => toast("Fonte aberta")}>
                  Ver documento de origem
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Amostra>

          <Amostra nome="Tooltip (reforço apenas)">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="fantasma">Passe o cursor</Button>
              </TooltipTrigger>
              <TooltipContent>
                Não aparece no toque. Nunca deixe informação essencial só aqui.
              </TooltipContent>
            </Tooltip>
          </Amostra>

          <Amostra nome="Command (cmdk)" className="p-0">
            <Command shouldFilter={false} className="border-0">
              <CommandInput placeholder="Nome ou número…" />
              <CommandList>
                <CommandEmpty>Nada encontrado.</CommandEmpty>
                <CommandGroup heading="Ordem sorteada">
                  {amostra.map((c) => (
                    <CommandItem key={c.id} value={c.id}>
                      <span className="font-mono tabular-nums text-tinta-400">
                        {c.numero}
                      </span>
                      {c.nomeUrna}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </Amostra>
        </div>
      </Secao>

      {/* ================= § 08 — Alternancia ================= */}
      <Secao
        folio="08"
        titulo="Alternância e ordenação"
        nota="A régua de cargo e a escolha de ordem, os dois controles que ficam sempre visíveis acima da lista."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Amostra nome="ToggleGroup — cargo">
            <ToggleGroup
              type="single"
              value={cargo}
              onValueChange={(v) => v && setCargo(v)}
              aria-label="Cargo em disputa"
            >
              <ToggleGroupItem value="todos">Todos</ToggleGroupItem>
              <ToggleGroupItem value="governador">Governador</ToggleGroupItem>
              <ToggleGroupItem value="senador">Senador</ToggleGroupItem>
            </ToggleGroup>
            <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.13em] text-tinta-500">
              Recorte atual: {cargo}
            </p>
          </Amostra>

          <Amostra nome="Progress — composição de presença">
            <div className="space-y-3">
              {[
                ["Presente", 82],
                ["Ausência justificada", 9],
                ["Missão oficial", 6],
                ["Sem justificativa", 3],
              ].map(([rotulo, valor]) => (
                <div key={rotulo as string}>
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="rotulo-meta">{rotulo}</span>
                    <span className="font-mono text-sm tabular-nums text-tinta-800">
                      {valor}%
                    </span>
                  </div>
                  <Progress value={valor as number} />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-tinta-600">
              Composição dentro de uma única ficha. Não serve para comparar
              candidaturas entre si.
            </p>
          </Amostra>
        </div>
      </Secao>

      {/* ================= § 09 — Dados ================= */}
      <Secao
        folio="09"
        titulo="Tabelas e carregamento"
        nota="Número sempre em fonte tabular e alinhado à direita. A tabela rola dentro do próprio bloco: em 360px a página nunca rola de lado."
      >
        <Table>
          <TableCaption>
            Bens declarados no registro — amostra fictícia.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor declarado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amostra[0]?.bens.slice(0, 4).map((bem) => (
              <TableRow key={bem.ordem}>
                <TableCellNumero className="text-left">
                  {String(bem.ordem).padStart(2, "0")}
                </TableCellNumero>
                <TableCell>{bem.tipo}</TableCell>
                <TableCell>{bem.descricao}</TableCell>
                <TableCellNumero>{reais(bem.valorNominal)}</TableCellNumero>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Amostra nome="Skeleton — verbete carregando">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Skeleton className="size-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </Amostra>

          <Amostra nome="Aviso passageiro (sonner)">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secundario"
                onClick={() => toast("Link da ficha copiado")}
              >
                Disparar aviso
              </Button>
              <Button
                variant="fantasma"
                onClick={() =>
                  toast("Candidatura adicionada", {
                    description: "Você pode comparar até 3 por vez.",
                  })
                }
              >
                Com descrição
              </Button>
            </div>
            <p className="mt-3 text-xs text-tinta-600">
              Só para confirmar uma ação. Dado eleitoral nunca vive num aviso
              que some em quatro segundos.
            </p>
          </Amostra>
        </div>
      </Secao>
    </>
  );
}
