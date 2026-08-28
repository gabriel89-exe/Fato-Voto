import type { MetadataRoute } from "next";
import { candidaturas, COLETADO_EM } from "@/lib/eleicao";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap.
 *
 * As fichas entram uma a uma — são elas que alguém procura ao buscar o
 * nome de um candidato, e sem sitemap um buscador levaria muito mais
 * tempo para achar as 575 a partir da lista paginada.
 *
 * Ficam de fora `/interface` (página de trabalho, também bloqueada no
 * robots.txt) e `/comparar`, que hoje é só um aviso de "ainda não
 * construído" — pedir indexação de um beco sem saída não ajuda ninguém
 * que chega pela busca. Ela continua alcançável pelo menu.
 *
 * `lastModified` é a data da coleta, não a do build: o que muda nestas
 * páginas é o dado do TSE, não o código.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const coleta = new Date(COLETADO_EM);

  const fixas: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: coleta, changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE_URL}/candidatos`,
      lastModified: coleta,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/fontes`,
      lastModified: coleta,
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/metodologia`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/quem-somos`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const fichas: MetadataRoute.Sitemap = candidaturas.map((c) => ({
    url: `${SITE_URL}/candidato/${c.id}`,
    lastModified: coleta,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...fixas, ...fichas];
}
