import { getDb } from './db';
import { products, essences } from '../drizzle/schema';
// import { eq } from 'drizzle-orm'; // Unused import removed

/**
 * Gerar sitemap.xml dinâmico
 */
export async function generateSitemap(baseUrl: string): Promise<string> {
  const db = await getDb();
  if (!db) {
    return generateStaticSitemap(baseUrl);
  }

  try {
    // Buscar todos os produtos
    const allProducts = await db.select({ id: products.id, updatedAt: products.updatedAt }).from(products);

    // Buscar todas as essências
    const allEssences = await db.select({ id: essences.id, updatedAt: essences.updatedAt }).from(essences);

    // URLs estáticas
    const staticUrls = [
      { loc: baseUrl, changefreq: 'weekly', priority: '1.0' },
      { loc: `${baseUrl}/produtos`, changefreq: 'daily', priority: '0.9' },
      { loc: `${baseUrl}/promocoes`, changefreq: 'weekly', priority: '0.8' },
    ];

    // URLs de produtos
    const productUrls = allProducts.map((product: any) => ({
      loc: `${baseUrl}/produtos/${product.id}`,
      lastmod: product.updatedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7',
    }));

    // Combinar todas as URLs
    const allUrls = [...staticUrls, ...productUrls];

    // Gerar XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${allUrls
  .map(
    (url: any) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return xml;
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    return generateStaticSitemap(baseUrl);
  }
}

/**
 * Gerar sitemap estático como fallback
 */
function generateStaticSitemap(baseUrl: string): string {
  const urls = [
    { loc: baseUrl, changefreq: 'weekly', priority: '1.0' },
    { loc: `${baseUrl}/produtos`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/promocoes`, changefreq: 'weekly', priority: '0.8' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url: any) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
}

/**
 * Escapar caracteres especiais XML
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
