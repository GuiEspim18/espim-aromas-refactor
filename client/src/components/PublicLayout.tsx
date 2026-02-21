import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  path: string;
}

interface PublicLayoutProps {
  children: React.ReactNode;
  config?: {
    site?: {
      name: string;
      tagline?: string;
    };
    navigation?: {
      main: NavItem[];
    };
    contact?: {
      phone?: string;
      email?: string;
    };
  };
}

export default function PublicLayout({ children, config }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Handle scroll effect for blur and transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const siteName = config?.site?.name || 'Espim Aromas';
  const navItems = config?.navigation?.main || [];
  const defaultPhone = '11 9000-0000';
  const defaultEmail = 'espim.aromas@gmail.com';
  const phone = config?.contact?.phone || defaultPhone;
  const email = config?.contact?.email || defaultEmail;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with Blur Effect */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-border/50 shadow-lg'
            : 'bg-white border-b border-border shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                  EA
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900">{siteName}</h1>
                  {config?.site?.tagline && (
                    <p className="text-xs text-gray-500">{config.site.tagline}</p>
                  )}
                </div>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.length > 0 ? (
                navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                      {item.label}
                    </a>
                  </Link>
                ))
              ) : (
                <>
                  <Link href="/">
                    <a className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                      Home
                    </a>
                  </Link>
                  <Link href="/produtos">
                    <a className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                      Produtos
                    </a>
                  </Link>
                  <Link href="/promocoes">
                    <a className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                      Promoções
                    </a>
                  </Link>
                </>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <Link href="/carrinho">
                <a className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </a>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-3">
              {navItems.length > 0 ? (
                navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))
              ) : (
                <>
                  <Link href="/">
                    <a
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </a>
                  </Link>
                  <Link href="/produtos">
                    <a
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Produtos
                    </a>
                  </Link>
                  <Link href="/promocoes">
                    <a
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Promoções
                    </a>
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-teal-700 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-lg mb-4">{siteName}</h3>
              <p className="text-teal-100 text-sm">
                Velas aromáticas artesanais feitas com essências naturais e cuidado especial.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contato</h3>
              <div className="space-y-2 text-sm text-teal-100">
                <p>
                  <span className="font-semibold">WhatsApp:</span>{' '}
                  <a
                    href={`https://wa.me/${phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {phone}
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{' '}
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-white transition-colors"
                  >
                    {email}
                  </a>
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm text-teal-100">
                <li>
                  <Link href="/produtos">
                    <a className="hover:text-white transition-colors">Produtos</a>
                  </Link>
                </li>
                <li>
                  <Link href="/promocoes">
                    <a className="hover:text-white transition-colors">Promoções</a>
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <a className="hover:text-white transition-colors">Home</a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-bold text-lg mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/espimaromas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-teal-100"
                  title="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com/espimaromas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-teal-100"
                  title="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-teal-600 pt-8 text-center text-sm text-teal-100">
            <p>© 2026 {siteName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
