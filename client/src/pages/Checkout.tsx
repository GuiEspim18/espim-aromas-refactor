import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

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
  checkout?: {
    title: string;
    subtitle: string;
    guestMessage: string;
  };
}

export default function Checkout() {
  const [config, setConfig] = useState<Config | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const createOrderMutation = trpc.orders.create.useMutation();

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    discountCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load config from JSON
  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      navigate('/carrinho');
    }
    setCart(savedCart);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Nome é obrigatório';
    }
    if (!formData.customerEmail.trim() || !formData.customerEmail.includes('@')) {
      newErrors.customerEmail = 'Email válido é obrigatório';
    }
    if (!formData.addressStreet.trim()) {
      newErrors.addressStreet = 'Rua é obrigatória';
    }
    if (!formData.addressNumber.trim()) {
      newErrors.addressNumber = 'Número é obrigatório';
    }
    if (!formData.addressCity.trim()) {
      newErrors.addressCity = 'Cidade é obrigatória';
    }
    if (!formData.addressState.trim()) {
      newErrors.addressState = 'Estado é obrigatório';
    }
    if (!formData.addressZip.trim()) {
      newErrors.addressZip = 'CEP é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const subtotal = cart.reduce((sum, item) => {
        return sum + parseFloat(item.price) * item.quantity;
      }, 0);

      const shippingCost = subtotal > 100 ? 0 : 15;
      const totalAmount = subtotal + shippingCost;

      const orderNumber = `ORD-${Date.now()}`;

      const orderData = {
        orderNumber,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        addressStreet: formData.addressStreet,
        addressNumber: formData.addressNumber,
        addressComplement: formData.addressComplement || undefined,
        addressCity: formData.addressCity,
        addressState: formData.addressState,
        addressZip: formData.addressZip,
        totalAmount: totalAmount.toString(),
        shippingCost: shippingCost.toString(),
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: (parseFloat(item.price) * item.quantity).toString(),
        })),
      };

      await createOrderMutation.mutateAsync(orderData);

      // Clear cart
      localStorage.setItem('cart', JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));

      // Redirect to success page
      navigate(`/pedido-confirmado/${orderNumber}`);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao processar seu pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  const shippingCost = subtotal > 100 ? 0 : 15;
  const total = subtotal + shippingCost;

  const checkoutConfig = config?.checkout || {
    title: 'Finalizar Compra',
    subtitle: 'Complete seu pedido em poucos passos',
    guestMessage: 'Compre como visitante - não é necessário cadastro!',
  };

  return (
    <PublicLayout config={config || undefined}>
      {/* Header */}
      <section className="bg-gradient-to-r from-teal-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {checkoutConfig.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {checkoutConfig.subtitle}
          </p>
          <p className="text-teal-600 font-semibold mt-2">
            ✓ {checkoutConfig.guestMessage}
          </p>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Informações Pessoais
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                          errors.customerName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Seu nome"
                      />
                      {errors.customerName && (
                        <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                          errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="seu@email.com"
                      />
                      {errors.customerEmail && (
                        <p className="text-red-600 text-sm mt-1">{errors.customerEmail}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                        placeholder="(11) 9 0000-0000"
                      />
                    </div>
                  </div>
                </Card>

                {/* Address Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Endereço de Entrega
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rua *
                      </label>
                      <input
                        type="text"
                        name="addressStreet"
                        value={formData.addressStreet}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                          errors.addressStreet ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Rua..."
                      />
                      {errors.addressStreet && (
                        <p className="text-red-600 text-sm mt-1">{errors.addressStreet}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Número *
                        </label>
                        <input
                          type="text"
                          name="addressNumber"
                          value={formData.addressNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                            errors.addressNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="123"
                        />
                        {errors.addressNumber && (
                          <p className="text-red-600 text-sm mt-1">{errors.addressNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Complemento
                        </label>
                        <input
                          type="text"
                          name="addressComplement"
                          value={formData.addressComplement}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                          placeholder="Apto 123"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          name="addressCity"
                          value={formData.addressCity}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                            errors.addressCity ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="São Paulo"
                        />
                        {errors.addressCity && (
                          <p className="text-red-600 text-sm mt-1">{errors.addressCity}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estado *
                        </label>
                        <input
                          type="text"
                          name="addressState"
                          value={formData.addressState}
                          onChange={handleInputChange}
                          maxLength={2}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                            errors.addressState ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="SP"
                        />
                        {errors.addressState && (
                          <p className="text-red-600 text-sm mt-1">{errors.addressState}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input
                        type="text"
                        name="addressZip"
                        value={formData.addressZip}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                          errors.addressZip ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="01234-567"
                      />
                      {errors.addressZip && (
                        <p className="text-red-600 text-sm mt-1">{errors.addressZip}</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 py-6 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Resumo do Pedido
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  {cart.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">
                        R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-semibold mb-2">Próximas Etapas:</p>
                  <ol className="space-y-1 text-xs">
                    <li>1. Confirme seu pedido</li>
                    <li>2. Escolha a forma de pagamento</li>
                    <li>3. Acompanhe sua entrega</li>
                  </ol>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
