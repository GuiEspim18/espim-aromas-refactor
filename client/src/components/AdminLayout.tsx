import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Package, Droplet, Image, ShoppingBag, Users } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      await logoutMutation.mutateAsync();
      window.location.href = '/';
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: ShoppingBag,
    },
    {
      label: 'Produtos',
      path: '/admin/produtos',
      icon: Package,
    },
    {
      label: 'Essências',
      path: '/admin/essencias',
      icon: Droplet,
    },
    {
      label: 'Banners',
      path: '/admin/banners',
      icon: Image,
    },
    {
      label: 'Pedidos',
      path: '/admin/pedidos',
      icon: ShoppingBag,
    },
    {
      label: 'Usuários Admin',
      path: '/admin/usuarios',
      icon: Users,
    },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <button
            onClick={() => window.location.href = '/admin/dashboard'}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full text-left"
          >
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
              EA
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-sm">Espim Aromas</h1>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => window.location.href = item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Info and Logout */}
        <div className="p-3 border-t border-gray-800 space-y-3">
          {sidebarOpen && (
            <div className="px-4 py-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Logado como</p>
              <p className="text-sm font-semibold text-white truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-gray-400">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
