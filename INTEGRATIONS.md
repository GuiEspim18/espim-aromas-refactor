# Guia de Integrações Externas

Este documento descreve como configurar e usar as integrações com Firebase, Stripe e APIs de correios/entregas no projeto Espim Aromas.

## Firebase Integration

### Configuração

Firebase fornece autenticação, armazenamento de arquivos e banco de dados em tempo real. Para configurar:

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative os serviços desejados (Authentication, Storage, Firestore)
4. Obtenha suas credenciais na seção "Project Settings"
5. Adicione as variáveis de ambiente:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### Uso

#### Autenticação

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '@/server/integrations';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

// Logout
await auth.signOut();
```

#### Armazenamento de Imagens

```typescript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '@/server/integrations';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Upload
const storageRef = ref(storage, `products/${productId}/image.jpg`);
await uploadBytes(storageRef, imageFile);

// Get URL
const url = await getDownloadURL(storageRef);
```

## Stripe Integration

### Configuração

Stripe é a plataforma de pagamento recomendada. Para configurar:

1. Crie uma conta em [Stripe](https://stripe.com)
2. Acesse o [Dashboard](https://dashboard.stripe.com)
3. Vá para "Developers" → "API Keys"
4. Copie suas chaves (Secret Key e Publishable Key)
5. Adicione as variáveis de ambiente:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key
```

### Uso

#### Criar Payment Intent

```typescript
import Stripe from 'stripe';
import { stripeConfig } from '@/server/integrations';

const stripe = new Stripe(stripeConfig.secretKey);

// Criar intenção de pagamento
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // Amount in cents (R$ 50.00)
  currency: 'brl',
  metadata: {
    orderId: '123',
    customerEmail: 'customer@example.com'
  }
});

// Retornar client_secret para o frontend
return { clientSecret: paymentIntent.client_secret };
```

#### Processar Pagamento no Frontend

```typescript
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-js';

const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);

// Dentro de um componente React
const { stripe, elements } = useStripe();
const cardElement = elements.getElement(CardElement);

const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name: 'John Doe' }
  }
});

if (paymentIntent.status === 'succeeded') {
  // Pagamento bem-sucedido
}
```

#### Webhook Handler

```typescript
import Stripe from 'stripe';
import { stripeConfig } from '@/server/integrations';

const stripe = new Stripe(stripeConfig.secretKey);

// No seu servidor (Express)
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Update order status in database
    await updateOrderPaymentStatus(paymentIntent.metadata.orderId, 'completed');
  }

  res.json({received: true});
});
```

## Correios / Delivery Integration

### Configuração

Para integração com serviços de entrega (Correios, Sedex, etc.):

1. Registre-se com um provedor de entrega
2. Obtenha suas credenciais de API
3. Adicione as variáveis de ambiente:

```env
SHIPPING_API_KEY=your_api_key
SHIPPING_API_URL=https://api.provider.com
SHIPPING_PROVIDER=correios
```

### Uso

#### Calcular Frete

```typescript
import { calculateShippingCost } from '@/server/integrations';

// Calcular custo de envio
const cost = await calculateShippingCost({
  originZip: '01234-567',
  destinationZip: '12345-678',
  weight: 1.5, // kg
  service: 'sedex'
});

console.log(`Shipping cost: R$ ${cost.toFixed(2)}`);
```

#### Gerar Etiqueta de Envio

```typescript
import { generateShippingLabel } from '@/server/integrations';

// Gerar etiqueta
const label = await generateShippingLabel({
  orderId: 'ORD-123456',
  recipientName: 'John Doe',
  recipientZip: '12345-678',
  weight: 1.5
});

// label.trackingCode: 'BR123456789BR'
// label.labelUrl: 'https://...' (PDF da etiqueta)
```

#### Rastrear Envio

```typescript
import { trackShipment } from '@/server/integrations';

// Rastrear pacote
const tracking = await trackShipment('BR123456789BR');

console.log(tracking.status); // 'in_transit', 'delivered', etc.
console.log(tracking.location); // Current location
console.log(tracking.estimatedDelivery); // Estimated delivery date
```

## Exemplo Completo: Fluxo de Checkout com Pagamento

```typescript
// 1. Criar pedido
const order = await createOrder({
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  totalAmount: 150.00,
  items: [...]
});

// 2. Calcular frete
const shippingCost = await calculateShippingCost({
  originZip: '01234-567',
  destinationZip: order.addressZip,
  weight: 2.5
});

// 3. Atualizar total do pedido
const totalWithShipping = order.totalAmount + shippingCost;

// 4. Criar intenção de pagamento
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(totalWithShipping * 100), // Convert to cents
  currency: 'brl',
  metadata: { orderId: order.id }
});

// 5. Retornar para o cliente processar pagamento
return {
  orderId: order.id,
  clientSecret: paymentIntent.client_secret,
  totalAmount: totalWithShipping
};

// 6. Após pagamento bem-sucedido (via webhook)
// - Gerar etiqueta de envio
// - Atualizar status do pedido
// - Enviar confirmação ao cliente
```

## Verificar Status das Integrações

```typescript
import { getIntegrationStatus } from '@/server/integrations';

const status = getIntegrationStatus();
console.log(status);
// {
//   firebase: { configured: true, status: 'ready' },
//   stripe: { configured: true, status: 'ready' },
//   shipping: { configured: false, status: 'not_configured', provider: 'correios' }
// }
```

## Troubleshooting

### Firebase não conecta
- Verifique se todas as variáveis de ambiente estão definidas
- Confirme que o projeto Firebase está ativo
- Verifique as regras de segurança do Firestore/Storage

### Stripe retorna erro
- Verifique se as chaves de API estão corretas
- Confirme que está usando a chave secreta no servidor (não no cliente)
- Verifique se o webhook está configurado corretamente

### Cálculo de frete falha
- Verifique se a API do provedor está acessível
- Confirme que os CEPs estão no formato correto
- Verifique se o peso do pacote está em kg

## Próximas Etapas

1. **Implementar UI de pagamento**: Adicionar componentes React para Stripe
2. **Adicionar rastreamento**: Mostrar status de entrega ao cliente
3. **Notificações**: Enviar emails quando pedido é enviado/entregue
4. **Relatórios**: Dashboard com dados de vendas e entregas
