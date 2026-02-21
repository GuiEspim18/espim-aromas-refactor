import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { updateSEO, addSchemaMarkup, type SEOConfig } from '@/lib/seo';

/**
 * Hook para gerenciar SEO em páginas
 */
export function useSEO(config: SEOConfig) {
  const [location] = useLocation();

  useEffect(() => {
    // Construir URL completa se não fornecida
    const fullConfig = {
      ...config,
      url: config.url || `${window.location.origin}${location}`,
    };

    // Atualizar meta tags
    updateSEO(fullConfig);

    // Scroll para o topo
    window.scrollTo(0, 0);
  }, [config, location]);
}

/**
 * Hook para adicionar schema markup
 */
export function useSchemaMarkup(schema: Record<string, any>) {
  useEffect(() => {
    addSchemaMarkup(schema);
  }, [schema]);
}
