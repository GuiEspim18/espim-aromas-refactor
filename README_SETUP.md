# Espim Aromas - Guia de Setup e Uso

Bem-vindo ao e-commerce refatorado da Espim Aromas! Este guia descreve como usar e configurar o projeto.

## Visão Geral

O projeto é um e-commerce completo para velas aromáticas artesanais com as seguintes características:

- **Loja Pública**: Catálogo de produtos, carrinho de compras e checkout sem obrigatoriedade de cadastro
- **Área Administrativa**: Gerenciamento de produtos, essências, banners e pedidos
- **Autenticação**: Sistema de login com OAuth (Manus) para administradores
- **Integrações**: Hooks preparados para Firebase, Stripe e APIs de correios
- **Conteúdo Dinâmico**: Produtos, essências e banners gerenciáveis via interface

## Estrutura do Projeto

```
espim-aromas-refactor/
├── client/                 # Frontend React
│   ├── public/            # Arquivos estáticos (config.json)
│   ├── src/
│   │   ├── pages/         # Páginas (Home, Produtos, Admin, etc)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários (tRPC client)
│   │   └── contexts/      # React contexts
│   └── index.html         # HTML principal
├── server/                # Backend Node.js/Express
│   ├── routers.ts         # Procedimentos tRPC
│   ├── db.ts              # Helpers de banco de dados
│   ├── integrations.ts    # Hooks para Firebase, Stripe, Correios
│   └── _core/             # Framework interno
├── drizzle/               # Schema e migrações do banco
├── shared/                # Código compartilhado
├── INTEGRATIONS.md        # Guia de integrações externas
└── package.json           # Dependências do projeto
```

## Começando

### 1. Iniciar o Servidor de Desenvolvimento

```bash
cd /home/ubuntu/espim-aromas-refactor
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

### 2. Acessar a Loja Pública

- **Home**: `http://localhost:3000/`
- **Produtos**: `http://localhost:3000/produtos`
- **Promoções**: `http://localhost:3000/promocoes`
- **Carrinho**: `http://localhost:3000/carrinho`
- **Checkout**: `http://localhost:3000/checkout`

### 3. Acessar a Área Administrativa

- **Login Admin**: `http://localhost:3000/admin/login`
- **Dashboard**: `http://localhost:3000/admin/dashboard` (após login)

## Funcionalidades Principais

### Loja Pública

#### Página Home
- Hero section com chamada para ação
- Banners promocionais (gerenciáveis na admin)
- Produtos em destaque
- Navegação intuitiva

#### Catálogo de Produtos
- Listagem de todos os produtos
- Busca e filtros
- Detalhes do produto com essências opcionais
- Adicionar ao carrinho

#### Carrinho de Compras
- Persistência em localStorage
- Atualizar quantidade
- Remover itens
- Cálculo automático de total

#### Checkout
- Formulário sem obrigatoriedade de cadastro
- Campos: nome, email, endereço, telefone (opcional)
- Integração com Stripe (hooks preparados)
- Integração com API de correios (hooks preparados)

### Área Administrativa

#### Dashboard
- Estatísticas: total de produtos, essências, banners, pedidos
- Resumo de pedidos recentes
- Informações do sistema

#### Gerenciamento de Produtos
- Listar todos os produtos
- Adicionar novo produto (nome, descrição, preço, imagem)
- Editar produto existente
- Remover produto
- Associar essências opcionais

#### Gerenciamento de Essências
- Listar todas as essências
- Adicionar nova essência
- Editar essência
- Remover essência

#### Gerenciamento de Banners
- Listar banners
- Adicionar novo banner (título, descrição, imagem, link)
- Editar banner
- Remover banner
- Definir ordem de exibição

#### Gerenciamento de Pedidos
- Listar todos os pedidos
- Filtrar por status (pendente, processando, enviado, entregue, cancelado)
- Atualizar status do pedido
- Ver detalhes do cliente e do pedido

#### Gerenciamento de Usuários Admin
- Listar usuários administradores
- Instruções para adicionar novos admins
- Instruções para remover admins

## Configuração de Dados

### Arquivo de Configuração JSON

O arquivo `client/public/config.json` contém configurações estáticas do site:

```json
{
  "site": {
    "name": "Espim Aromas",
    "description": "Velas Aromáticas Artesanais",
    "logo": "/logo.png"
  },
  "contact": {
    "phone": "11 9000-0000",
    "email": "contato@espimaromas.com",
    "instagram": "@espimaromas"
  },
  "navigation": [
    { "label": "Home", "href": "/" },
    { "label": "Produtos", "href": "/produtos" },
    { "label": "Promoções", "href": "/promocoes" }
  ]
}
```

### Banco de Dados

O projeto usa MySQL com Drizzle ORM. As tabelas incluem:

- **users**: Usuários do sistema (admin e clientes)
- **products**: Produtos (velas aromáticas)
- **essences**: Essências disponíveis
- **productEssences**: Associação entre produtos e essências
- **banners**: Banners promocionais
- **orders**: Pedidos de clientes
- **orderItems**: Itens de cada pedido
- **siteConfig**: Configurações do site

## Integrações Externas

### Firebase

Para adicionar autenticação e armazenamento Firebase:

1. Crie um projeto em [Firebase Console](https://console.firebase.google.com)
2. Adicione as variáveis de ambiente (veja `INTEGRATIONS.md`)
3. Use os hooks em `server/integrations.ts`

### Stripe

Para adicionar pagamentos com Stripe:

1. Crie uma conta em [Stripe](https://stripe.com)
2. Obtenha suas chaves de API
3. Adicione as variáveis de ambiente
4. Use os hooks em `server/integrations.ts`

### Correios / Entregas

Para integração com API de correios:

1. Registre-se com um provedor (Correios, Sedex, etc)
2. Obtenha credenciais de API
3. Adicione as variáveis de ambiente
4. Use os hooks em `server/integrations.ts`

Veja `INTEGRATIONS.md` para instruções detalhadas.

## Adicionando Produtos

### Via Interface Admin

1. Acesse `/admin/dashboard`
2. Clique em "Produtos" no menu
3. Clique em "Novo Produto"
4. Preencha os campos:
   - **Nome**: Nome do produto (ex: "Vela Aromática de Lavanda")
   - **Descrição**: Descrição detalhada
   - **Preço**: Preço em reais (ex: 49.90)
   - **URL da Imagem**: Link para a imagem do produto
5. Clique em "Salvar Produto"

### Associando Essências

1. Na página de produtos admin, edite o produto
2. As essências podem ser associadas através da interface
3. Essências são opcionais - nem todo produto precisa ter

## Adicionando Banners

1. Acesse `/admin/dashboard`
2. Clique em "Banners" no menu
3. Clique em "Novo Banner"
4. Preencha os campos:
   - **Título**: Título do banner
   - **Descrição**: Descrição (opcional)
   - **URL da Imagem**: Link para a imagem
   - **Link**: URL para onde o banner leva (opcional)
   - **Ordem de Exibição**: Número para ordenar na página
5. Clique em "Salvar Banner"

Os banners aparecerão na página Home em ordem de exibição.

## Fluxo de Checkout

1. Cliente adiciona produtos ao carrinho
2. Cliente clica em "Ir para Carrinho"
3. Cliente revisa itens e clica em "Checkout"
4. Cliente preenche formulário (nome, email, endereço)
5. Cliente seleciona método de entrega (calcula frete)
6. Cliente processa pagamento (Stripe)
7. Pedido é criado no banco de dados
8. Admin recebe notificação e pode gerenciar pedido

## Testes

Para rodar os testes:

```bash
pnpm test
```

Os testes estão em `server/*.test.ts` usando Vitest.

## Troubleshooting

### Servidor não inicia
```bash
# Limpar cache e reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Banco de dados não conecta
- Verifique se `DATABASE_URL` está configurado
- Confirme que o banco de dados está acessível
- Execute migrações: `pnpm db:push`

### Produtos não aparecem
- Verifique se há produtos cadastrados no banco
- Confirme que a query `trpc.products.list` está funcionando
- Verifique logs do servidor

### Admin não consegue fazer login
- Verifique se o usuário tem role "admin" no banco
- Confirme que as variáveis de OAuth estão configuradas
- Tente fazer logout e login novamente

## Próximas Etapas

1. **Customizar cores e fontes**: Edite `client/src/index.css`
2. **Adicionar mais produtos**: Use a interface admin
3. **Configurar integrações**: Siga `INTEGRATIONS.md`
4. **Adicionar mais admins**: Use o banco de dados
5. **Publicar**: Use o botão "Publish" na interface Manus

## Suporte

Para dúvidas ou problemas, consulte:
- `INTEGRATIONS.md` - Guia de integrações externas
- `server/integrations.ts` - Código das integrações
- Template README - Documentação do template base

## Licença

Este projeto é propriedade da Espim Aromas.
