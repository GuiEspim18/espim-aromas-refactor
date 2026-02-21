/**
 * SEO Utilities for managing meta tags, Open Graph, and schema markup
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

export interface ProductSEO extends SEOConfig {
  price?: string;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: number;
  reviewCount?: number;
}

/**
 * Update document title and meta tags
 */
export function updateSEO(config: SEOConfig) {
  // Update title
  document.title = config.title;

  // Update or create meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', config.description);

  // Update or create meta keywords
  if (config.keywords && config.keywords.length > 0) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.keywords.join(', '));
  }

  // Update Open Graph tags
  updateOpenGraph(config);

  // Update Twitter Card tags
  updateTwitterCard(config);

  // Update canonical tag
  if (config.url) {
    updateCanonical(config.url);
  }
}

/**
 * Update Open Graph meta tags
 */
function updateOpenGraph(config: SEOConfig) {
  const ogTags = [
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:type', content: config.type || 'website' },
    ...(config.url ? [{ property: 'og:url', content: config.url }] : []),
    ...(config.image ? [{ property: 'og:image', content: config.image }] : []),
  ];

  ogTags.forEach(({ property, content }) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });
}

/**
 * Update Twitter Card meta tags
 */
function updateTwitterCard(config: SEOConfig) {
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description },
    ...(config.image ? [{ name: 'twitter:image', content: config.image }] : []),
  ];

  twitterTags.forEach(({ name, content }) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });
}

/**
 * Update canonical tag
 */
function updateCanonical(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

/**
 * Add JSON-LD schema markup
 */
export function addSchemaMarkup(schema: Record<string, any>) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Generate Organization schema
 */
export function getOrganizationSchema(config: {
  name: string;
  description: string;
  logo: string;
  url: string;
  email: string;
  phone: string;
  address?: string;
  socialProfiles?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    description: config.description,
    logo: config.logo,
    url: config.url,
    email: config.email,
    telephone: config.phone,
    ...(config.address && { address: config.address }),
    ...(config.socialProfiles && {
      sameAs: config.socialProfiles,
    }),
  };
}

/**
 * Generate Product schema
 */
export function getProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: number;
  reviewCount?: number;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: product.url,
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      },
    }),
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function getBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate LocalBusiness schema
 */
export function getLocalBusinessSchema(config: {
  name: string;
  description: string;
  image: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: config.name,
    description: config.description,
    image: config.image,
    telephone: config.phone,
    email: config.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.address,
      addressLocality: config.city,
      addressRegion: config.state,
      postalCode: config.postalCode,
      addressCountry: 'BR',
    },
    url: config.url,
  };
}
