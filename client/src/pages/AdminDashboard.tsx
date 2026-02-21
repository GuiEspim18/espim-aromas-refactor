import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import AdminLayout from '@/components/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Package, Droplet, Image, ShoppingBag, TrendingUp, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, loading } = useFirebaseAuth();

  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: essences, isLoading: essencesLoading } = trpc.essences.list.useQuery();
  const { data: banners, isLoading: bannersLoading } = trpc.banners.list.useQuery();
  const { data: orders, isLoading: ordersLoading } = trpc.orders.list.useQuery();

  // 🔒 Proteção correta contra loop
  useEffect(() => {
    if (loading) return; // espera Firebase terminar

    if (!user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  // Enquanto verifica sessão
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Evita renderizar antes do redirect
  if (!user) {
    return null;
  }

  const stats = [
    {
      label: 'Produtos',
      value: products?.length || 0,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/produtos',
    },
    {
      label: 'Essências',
      value: essences?.length || 0,
      icon: Droplet,
      color: 'bg-purple-500',
      href: '/admin/essencias',
    },
    {
      label: 'Banners',
      value: banners?.length || 0,
      icon: Image,
      color: 'bg-green-500',
      href: '/admin/banners',
    },
    {
      label: 'Pedidos',
      value: orders?.length || 0,
      icon: ShoppingBag,
      color: 'bg-orange-500',
      href: '/admin/pedidos',
    },
  ];

  const isLoadingData =
    productsLoading || essencesLoading || bannersLoading || ordersLoading;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.displayName || user?.email || 'Administrador'}!
          </h2>
          <p className="text-gray-600">
            Aqui você pode gerenciar todos os aspectos da sua loja.
          </p>
        </div>

        {/* Stats */}
        {isLoadingData ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <a
                  key={stat.label}
                  href={stat.href}
                  className="block hover:scale-105 transition-transform"
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.color} p-4 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>
        )}

        {/* System Info */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Informações do Sistema
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Versão</p>
              <p className="font-semibold text-gray-900">1.0.0</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Usuário</p>
              <p className="font-semibold text-gray-900">
                {user?.email}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}