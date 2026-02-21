# Guia de SEO - Espim Aromas

Este documento descreve as otimizações SEO implementadas no projeto e como utilizá-las.

## Visão Geral

O projeto foi otimizado para SEO seguindo as melhores práticas de mecanismos de busca (Google, Bing, etc). As otimizações incluem meta tags, schema markup, sitemap, robots.txt e muito mais.

## Meta Tags

### Tags Básicas

Todas as páginas incluem as meta tags essenciais:

```html
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta name="author" content="Espim Aromas" />
<meta name="robots" content="index, follow" />
```

### Open Graph Tags

Para melhor compartilhamento em redes sociais:

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:url" content="..." />
<meta property="og:image" content="..." />
<meta property="og:locale" content="pt_BR" />
```

### Twitter Card Tags

Para melhor visualização no Twitter/X:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

## Schema Markup (JSON-LD)

O projeto implementa schema markup estruturado para ajudar os mecanismos de busca a entender o conteúdo.

### Organization Schema

Identifica a organização e suas informações de contato:

```typescript
import { getOrganizationSchema } from '@/lib/seo';

const schema = getOrganizationSchema({
  name: 'Espim Aromas',
  description: 'Velas aromáticas artesanais',
  logo: 'https://espimaromas.com/logo.svg',
  url: 'https://espimaromas.com',
  email: 'espim.aromas@gmail.com',
  phone: '11 9000-0000',
  socialProfiles: [
    'https://instagram.com/espimaromas',
    'https://facebook.com/espimaromas',
  ],
});
```

### Product Schema

Identifica produtos e suas informações:

```typescript
import { getProductSchema } from '@/lib/seo';

const schema = getProductSchema({
  name: 'Vela Aromática de Lavanda',
  description: 'Vela aromática artesanal com essência de lavanda',
  image: 'https://espimaromas.com/products/lavanda.jpg',
  price: '49.90',
  currency: 'BRL',
  availability: 'InStock',
  rating: 4.5,
  reviewCount: 120,
  url: 'https://espimaromas.com/produtos/1',
});
```

### BreadcrumbList Schema

Para navegação estruturada:

```typescript
import { getBreadcrumbSchema } from '@/lib/seo';

const schema = getBreadcrumbSchema([
  { name: 'Home', url: 'https://espimaromas.com' },
  { name: 'Produtos', url: 'https://espimaromas.com/produtos' },
  { name: 'Lavanda', url: 'https://espimaromas.com/produtos/1' },
]);
```

## Usando o Hook useSEO

Para adicionar SEO a uma página, use o hook `useSEO`:

```typescript
import { useSEO, useSchemaMarkup } from '@/hooks/useSEO';
import { getOrganizationSchema } from '@/lib/seo';

export default function MinhaPage() {
  // Atualizar meta tags
  useSEO({
    title: 'Minha Página - Espim Aromas',
    description: 'Descrição da minha página',
    keywords: ['palavra-chave1', 'palavra-chave2'],
    type: 'website',
  });

  // Adicionar schema markup
  useSchemaMarkup(
    getOrganizationSchema({
      name: 'Espim Aromas',
      // ... outras propriedades
    })
  );

  return <div>Conteúdo da página</div>;
}
```

## Sitemap.xml

O sitemap é gerado dinamicamente em `server/sitemap.ts` e inclui:

- Página inicial
- Página de produtos
- Página de promoções
- Todos os produtos individuais

Para acessar o sitemap:

```
https://espimaromas.com/sitemap.xml
```

## Robots.txt

O arquivo `robots.txt` está em `client/public/robots.txt` e define as regras de rastreamento:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
```

## Otimizações de Performance

### Lazy Loading de Imagens

As imagens são carregadas sob demanda com `loading="lazy"`:

```tsx
<img
  src={product.imageUrl}
  alt={product.name}
  loading="lazy"
/>
```

### Preconnect para Recursos Externos

O HTML inclui preconnect para melhorar performance:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://api.manus.im" />
```

## Canonical Tags

Cada página inclui um canonical tag para evitar conteúdo duplicado:

```html
<link rel="canonical" href="https://espimaromas.com/pagina" />
```

## Manifest.json

O arquivo `manifest.json` permite que o site seja instalado como Progressive Web App (PWA):

```json
{
  "name": "Espim Aromas - Velas Aromáticas Artesanais",
  "short_name": "Espim Aromas",
  "description": "Velas aromáticas artesanais feitas com essências naturais",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0d9488"
}
```

## Checklist de SEO

Antes de publicar, verifique:

- [ ] Todas as páginas têm meta description
- [ ] Todas as imagens têm alt text descritivo
- [ ] URLs são amigáveis (legíveis e descritivas)
- [ ] Heading hierarchy está correta (h1, h2, h3...)
- [ ] Links internos estão funcionando
- [ ] Sitemap.xml é válido
- [ ] Robots.txt está configurado corretamente
- [ ] Mobile responsiveness está funcionando
- [ ] Page speed é aceitável (>50 no Lighthouse)
- [ ] Schema markup é válido (teste em https://schema.org/validator)

## Ferramentas Recomendadas

1. **Google Search Console**: Monitorar indexação e performance
2. **Google PageSpeed Insights**: Medir performance e SEO
3. **Schema.org Validator**: Validar schema markup
4. **SEMrush**: Análise de palavras-chave e concorrência
5. **Lighthouse**: Auditoria de performance e SEO

## Próximas Etapas

1. **Google Analytics**: Adicionar rastreamento de visitantes
2. **Google Search Console**: Submeter sitemap
3. **Monitoramento**: Acompanhar rankings e tráfego
4. **Conteúdo**: Criar blog com artigos otimizados
5. **Link Building**: Construir backlinks de qualidade

## Referências

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org)
- [MDN Web Docs - SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO)
- [Web.dev - SEO Starter Guide](https://web.dev/lighthouse-seo/)
