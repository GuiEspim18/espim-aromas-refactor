import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  isActive?: boolean;
}

interface Config {
  site?: { name: string; tagline?: string };
  navigation?: { main: any[] };
  contact?: { phone?: string; email?: string };
  pages?: { produtos?: { title: string; subtitle?: string } };
}

export default function Produtos() {
  const [config, setConfig] = useState<Config | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  const { data: products, isLoading, error } = trpc.products.list.useQuery<Product[]>(undefined, {
    retry: false,
  });

  // SEO
  useSEO({
    title: 'Produtos - Espim Aromas | Velas Aromáticas Artesanais',
    description:
      'Confira nosso catálogo completo de velas aromáticas artesanais com essências naturais. Encontre o aroma perfeito para você.',
    keywords: ['velas aromáticas', 'velas artesanais', 'essências naturais', 'catálogo', 'loja online'],
    type: 'website',
  });

  // Load config from JSON
  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(setConfig)
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  const produtosConfig = config?.pages?.produtos || {
    title: 'Nossos Produtos',
    subtitle: 'Explore nossa coleção de velas aromáticas artesanais',
  };

  // Filter and sort products
  let filteredProducts = products || [];
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
    return a.name.localeCompare(b.name);
  });

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as {
      productId: string;
      name: string;
      price: string;
      quantity: number;
      imageUrl?: string;
    }[];

    const existing = cart.find(item => item.productId === product.id);

    if (existing) existing.quantity += 1;
    else
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      });

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Produto adicionado ao carrinho!');
  };

  return (
    <PublicLayout config={config || undefined}>
      <section className="bg-gradient-to-r from-teal-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{produtosConfig.title}</h1>
          <p className="text-gray-600 text-lg">{produtosConfig.subtitle}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="name">Ordenar por Nome</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>

          {/* Error or Loading */}
          {error && (
            <p className="text-red-600 mb-6">Erro ao carregar produtos. Tente novamente mais tarde.</p>
          )}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Link key={product.id} href={`/produtos/${product.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden flex flex-col cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center text-teal-700">
                          <p className="text-sm font-semibold">Imagem do Produto</p>
                          <p className="text-xs text-teal-600">{product.name}</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                        <span className="text-xl font-bold text-teal-600">
                          R$ {parseFloat(product.price).toFixed(2)}
                        </span>
                        <button
                          onClick={e => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                          title="Adicionar ao carrinho"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                {searchTerm ? 'Nenhum produto encontrado com esses critérios.' : 'Nenhum produto disponível no momento.'}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50"
                >
                  Limpar Busca
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}