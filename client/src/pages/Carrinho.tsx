import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  imageUrl?: string;
}

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

export default function Carrinho() {
  const [config, setConfig] = useState<Config | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [, navigate] = useLocation();

  // Load config from JSON
  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(savedCart);
    };

    loadCart();
    window.addEventListener('storage', loadCart);
    window.addEventListener('cartUpdated', loadCart);

    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      setCart([]);
      localStorage.setItem('cart', JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  const shippingCost = subtotal > 100 ? 0 : 15;
  const total = subtotal + shippingCost;

  return (
    <PublicLayout config={config || undefined}>
      {/* Header */}
      <section className="bg-gradient-to-r from-teal-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Carrinho de Compras
          </h1>
          <p className="text-gray-600 text-lg">
            Revise seus itens antes de finalizar a compra
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Seu carrinho está vazio
              </h2>
              <p className="text-gray-600 mb-8">
                Comece a adicionar produtos para sua compra.
              </p>
              <Link href="/produtos">
                <a>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Continuar Comprando
                  </Button>
                </a>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.productId} className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-xs text-teal-700 text-center px-2">
                              Imagem
                            </span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-teal-600 font-semibold mb-4">
                            R$ {parseFloat(item.price).toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal and Remove */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 mb-4">
                            R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover do carrinho"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 text-right">
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Resumo do Pedido
                  </h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">
                        R$ {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frete:</span>
                      <span className="font-semibold">
                        {shippingCost === 0 ? (
                          <span className="text-green-600">Grátis</span>
                        ) : (
                          `R$ ${shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-gray-500">
                        Frete grátis em compras acima de R$ 100,00
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-2xl font-bold text-teal-600">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-teal-600 hover:bg-teal-700 mb-3"
                  >
                    Finalizar Compra
                  </Button>

                  <Link href="/produtos">
                    <a>
                      <Button
                        variant="outline"
                        className="w-full border-teal-600 text-teal-600 hover:bg-teal-50"
                      >
                        Continuar Comprando
                      </Button>
                    </a>
                  </Link>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
