import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt.
 *
 * `/interface` fica de fora do índice de propósito: é a vitrine dos
 * componentes, página de trabalho e não de produto. Aparecer numa busca
 * por candidatura seria só ruído — e ela não tem informação nenhuma
 * sobre a eleição.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/interface",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
