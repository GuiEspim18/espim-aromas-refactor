import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface Config {
  site?: {
    name: string;
    tagline?: string;
  };
  navigation?: {
    main: any[];
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  pages?: {
    promocoes?: {
      title: string;
      subtitle: string;
    };
  };
}

export default function Promocoes() {
  const [config, setConfig] = useState<Config | null>(null);

  // Load config from JSON
  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  const promocoesConfig = config?.pages?.promocoes || {
    title: 'Promoções',
    subtitle: 'Aproveite nossas ofertas especiais',
  };

  // Mock promotions data
  const promotions = [
    {
      id: 1,
      title: 'Desconto de 20% em Velas Aromáticas',
      description: 'Aproveite 20% de desconto em toda a coleção de velas aromáticas.',
      discount: '20%',
      validUntil: '31/12/2026',
      code: 'AROMA20',
    },
    {
      id: 2,
      title: 'Compre 2 e Ganhe 1',
      description: 'Compre 2 velas aromáticas e ganhe a terceira com 50% de desconto.',
      discount: 'COMPRE 2',
      validUntil: '28/02/2026',
      code: 'COMPRE2',
    },
    {
      id: 3,
      title: 'Frete Grátis',
      description: 'Frete grátis em compras acima de R$ 100,00.',
      discount: 'FRETE',
      validUntil: '31/03/2026',
      code: 'FRETELIVRE',
    },
    {
      id: 4,
      title: 'Kit Essências em Promoção',
      description: 'Kit com 5 essências diferentes por apenas R$ 79,90.',
      discount: 'KIT',
      validUntil: '15/03/2026',
      code: 'KITESSENCIAS',
    },
  ];

  return (
    <PublicLayout config={config || undefined}>
      {/* Header */}
      <section className="bg-gradient-to-r from-teal-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {promocoesConfig.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {promocoesConfig.subtitle}
          </p>
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions.map((promo) => (
              <Card
                key={promo.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold flex-1">{promo.title}</h3>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-bold">{promo.discount}</span>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4">{promo.description}</p>
                  <p className="text-sm text-white/70">
                    Válido até: <span className="font-semibold">{promo.validUntil}</span>
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Código de Desconto:</p>
                    <p className="text-2xl font-bold text-teal-600 font-mono">
                      {promo.code}
                    </p>
                  </div>

                  <Link href="/produtos">
                    <a>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">
                        Aproveitar Oferta
                      </Button>
                    </a>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Como usar os códigos de desconto?
            </h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <span>Selecione os produtos que deseja comprar</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <span>Vá para o carrinho de compras</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <span>No checkout, insira o código de desconto no campo apropriado</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <span>Finalize sua compra e aproveite o desconto!</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Não perca nossas promoções!
          </h2>
          <p className="text-teal-100 mb-6">
            Acompanhe nossas redes sociais para ficar atualizado com as melhores ofertas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-teal-600 hover:bg-gray-100">
              Instagram
            </Button>
            <Button className="bg-white text-teal-600 hover:bg-gray-100">
              Facebook
            </Button>
            <Button className="bg-white text-teal-600 hover:bg-gray-100">
              WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
