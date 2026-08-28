import { ImageResponse } from "next/og";
import { candidaturas, ELEICAO, ESTADO } from "@/lib/eleicao";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Fato & Voto — dados públicos das candidaturas do Espírito Santo, sem ranking e sem recomendação";

/**
 * Imagem de compartilhamento (WhatsApp, redes, prévia de link).
 *
 * Gerada por código em vez de ser um arquivo desenhado à mão porque
 * carrega números que mudam: a contagem de candidaturas vem do mesmo
 * JSON que o site lê, então a prévia não envelhece sozinha.
 *
 * A frase de independência entra aqui pelo mesmo motivo que está na
 * tarja do topo: a prévia costuma ser a PRIMEIRA coisa que a pessoa vê,
 * muitas vezes a única, e a interface se parece com um site de governo.
 *
 * Nada de cor com juízo de valor e nenhum nome de candidatura — a regra
 * vale para a prévia como vale para a tela.
 */
export default function ImagemDeCompartilhamento() {
  const chapeu = `${ESTADO.nome} · Eleição ${ELEICAO.ano}`;
  const linhaDados = `${candidaturas.length} candidaturas · dados oficiais do Tribunal Superior Eleitoral`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f7f5f1",
        }}
      >
        <div style={{ display: "flex", height: 18, backgroundColor: "#3f37a8" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          <div style={{ display: "flex", fontSize: 32, color: "#3f37a8" }}>
            {chapeu}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              color: "#191713",
              letterSpacing: "-0.03em",
              marginTop: 12,
            }}
          >
            Fato &amp; Voto
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 44,
              color: "#383430",
              marginTop: 20,
              lineHeight: 1.3,
            }}
          >
            Sem ranking, sem nota e sem recomendação
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#5f5951",
              marginTop: 28,
            }}
          >
            {linhaDados}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1a1550",
            color: "#ffffff",
            fontSize: 28,
            padding: "26px 80px",
          }}
        >
          Site independente, sem vínculo com o governo
        </div>
      </div>
    ),
    size,
  );
}
