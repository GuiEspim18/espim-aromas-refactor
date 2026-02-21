import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useSEO, useSchemaMarkup } from "@/hooks/useSEO";
import { getOrganizationSchema } from "@/lib/seo";

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
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [config, setConfig] = useState<Config | null>(null);

  const { data: banners } = trpc.banners.list.useQuery();
  const { data: products } = trpc.products.list.useQuery();

  // ✅ AGORA O STATE USA O TIPO INFERIDO DO TRPC (SEM DUPLICAR TYPE)
  const [featuredProducts, setFeaturedProducts] = useState<
    typeof products extends Array<infer T> ? T[] : any[]
  >([]);

  // Load config
  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error("Failed to load config:", err));
  }, []);

  // SEO
  useSEO({
    title: "Espim Aromas - Velas Aromáticas Artesanais",
    description:
      "Velas aromáticas artesanais feitas com essências naturais. Descubra o aroma perfeito para seu espaço.",
    keywords: [
      "velas aromáticas",
      "velas artesanais",
      "essências naturais",
      "decoração",
      "aromaterapia",
    ],
    type: "website",
  });

  // Schema
  useSchemaMarkup(
    getOrganizationSchema({
      name: "Espim Aromas",
      description:
        "Velas aromáticas artesanais feitas com essências naturais",
      logo: "/logo.svg",
      url: window.location.origin,
      email: "espim.aromas@gmail.com",
      phone: "11 9000-0000",
    })
  );

  // Featured products
  useEffect(() => {
    if (products && products.length > 0) {
      setFeaturedProducts(products.slice(0, 3));
    }
  }, [products]);

  return (
    <PublicLayout config={config || undefined}>
      {/* HERO */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo à Espim Aromas
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Descubra o aroma perfeito para seu espaço
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Velas aromáticas artesanais feitas com essências naturais e cuidado especial
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/produtos")}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Explorar Produtos
          </Button>
        </div>
      </section>

      {/* BANNERS */}
      {banners && banners.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.slice(0, 2).map((banner) => (
                <Card
                  key={banner.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => banner.link && setLocation(banner.link)}
                >
                  <div className="aspect-video bg-teal-200 flex items-center justify-center">
                    {banner.imageUrl ? (
                      <img
                        src={banner.imageUrl}
                        alt={banner.title ?? ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-600">
                          {banner.title ?? "Banner"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {banner.title}
                    </h3>
                    {banner.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {banner.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Produtos em Destaque
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Conheça nossas velas aromáticas mais populares
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setLocation(`/produtos/${product.id}`)}
                >
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-teal-600">
                        R$ {parseFloat(product.price).toFixed(2)}
                      </span>
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Aproveite!
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Compre agora e receba seu aroma perfeito em casa
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setLocation("/produtos")}
          >
            Comprar Agora
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}