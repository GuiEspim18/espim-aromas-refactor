# Configuração de Variáveis de Ambiente

Este projeto usa variáveis de ambiente para configurar Firebase, autenticação e outras integrações. A maioria das variáveis é gerenciada automaticamente pelo Manus, mas você precisa configurar as credenciais do Firebase.

## Variáveis Necessárias

### 🔥 Firebase Configuration (OBRIGATÓRIO)

Obtenha essas credenciais em: https://console.firebase.google.com

```
VITE_FIREBASE_API_KEY=AIzaSyDhPvhnfOsbx9bNlYGHN5ZK8AishH9I59Y
VITE_FIREBASE_AUTH_DOMAIN=espim-aromas.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=espim-aromas
VITE_FIREBASE_STORAGE_BUCKET=espim-aromas.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=776690013203
VITE_FIREBASE_APP_ID=1:776690013203:web:19ecbe0859a7e25988dbe6
```

**Como obter:**
1. Acesse https://console.firebase.google.com
2. Selecione seu projeto "espim-aromas"
3. Vá para Configurações do Projeto (⚙️)
4. Na aba "Geral", role até "Seus aplicativos"
5. Clique em seu app web para ver as credenciais
6. Copie os valores para as variáveis acima

### 🔐 Autenticação Manus (Gerenciado Automaticamente)

Essas variáveis são configuradas automaticamente pelo Manus:

```
JWT_SECRET=<gerenciado pelo Manus>
VITE_APP_ID=<gerenciado pelo Manus>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_NAME=<seu nome>
OWNER_OPEN_ID=<seu ID>
```

### 📊 Banco de Dados (Gerenciado Automaticamente)

```
DATABASE_URL=<gerenciado pelo Manus>
```

### 🛠️ APIs Manus Built-in (Gerenciado Automaticamente)

```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=<gerenciado pelo Manus>
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=<gerenciado pelo Manus>
```

### 📈 Analytics (Opcional)

```
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=<seu ID de website>
```

### 🎨 Configuração do App (Opcional)

```
VITE_APP_TITLE=Espim Aromas
VITE_APP_LOGO=/logo.svg
```

### 💳 Stripe (Opcional - Para Pagamentos)

Obtenha em: https://dashboard.stripe.com/apikeys

```
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 📦 Correios API (Opcional - Para Cálculo de Frete)

```
CORREIOS_API_KEY=<sua chave>
CORREIOS_API_URL=https://api.correios.com.br
```

## Como Configurar

### Opção 1: Via Painel Manus (Recomendado)

1. Acesse o painel do seu projeto Manus
2. Vá para **Settings → Secrets**
3. Clique em "Add Secret" e adicione as variáveis do Firebase
4. As variáveis serão injetadas automaticamente no seu projeto

### Opção 2: Arquivo .env Local (Desenvolvimento)

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as variáveis necessárias (veja exemplo abaixo)
3. O arquivo `.env.local` é ignorado pelo Git (seguro)

**Exemplo de .env.local:**

```bash
# Firebase
VITE_FIREBASE_API_KEY=AIzaSyDhPvhnfOsbx9bNlYGHN5ZK8AishH9I59Y
VITE_FIREBASE_AUTH_DOMAIN=espim-aromas.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=espim-aromas
VITE_FIREBASE_STORAGE_BUCKET=espim-aromas.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=776690013203
VITE_FIREBASE_APP_ID=1:776690013203:web:19ecbe0859a7e25988dbe6
```

## Verificação

Para verificar se as variáveis estão configuradas corretamente:

1. Acesse a página de Admin (`/admin`)
2. Tente criar um novo produto
3. Faça upload de uma imagem
4. Se a imagem for salva com sucesso no Firestore, tudo está funcionando!

## Segurança

⚠️ **IMPORTANTE:**
- Nunca commit `.env.local` no Git
- Nunca compartilhe suas chaves do Firebase publicamente
- Use chaves de teste (test keys) do Stripe em desenvolvimento
- Mude para chaves de produção apenas quando estiver pronto para publicar

## Troubleshooting

### "Firebase não está inicializado"
- Verifique se `VITE_FIREBASE_API_KEY` está configurado
- Certifique-se de que o projeto Firebase existe em https://console.firebase.google.com

### "Erro ao salvar produto"
- Verifique se o Firestore está habilitado no Firebase Console
- Vá para **Firestore Database** e crie um banco de dados
- Certifique-se de que as regras de segurança permitem leitura/escrita

### "Imagem não salva"
- Verifique se a pasta `/public/uploads` existe
- Certifique-se de que o servidor tem permissão de escrita
- Verifique o console do navegador para erros

## Próximos Passos

1. Configure as credenciais do Firebase no painel Manus
2. Teste criando um produto com imagem na área admin
3. Quando pronto para pagamentos, adicione credenciais do Stripe
4. Para cálculo de frete, configure a API dos Correios
