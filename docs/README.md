# 🚀 Documentação Técnica - Gubi Server

## 📋 Índice
- [🏗️ Visão Geral](#️-visão-geral)
- [⚡ Quick Start](#-quick-start)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🗃️ Banco de Dados](#️-banco-de-dados)
- [🔐 Autenticação](#-autenticação)
- [📚 API Endpoints](#-api-endpoints)
- [🧪 Testes](#-testes)
- [🚀 Deploy](#-deploy)
- [📖 Guias Avançados](#-guias-avançados)

---

## 🏗️ Visão Geral

O **Gubi Server** é uma API REST desenvolvida em **Node.js + TypeScript** que oferece funcionalidades de:

- 🔐 **Autenticação completa** (registro, login, recuperação de senha)
- 🎮 **Sistema Discovery** (progresso gamificado de autodescoberta)
- 👤 **Perfil de usuário** (interesses, educação, habilidades, etc.)
- 📊 **Exportação de dados** em CSV
- 📖 **Documentação Swagger** em português

### Stack Tecnológica
- **Backend:** Node.js 18+, TypeScript, Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT (JSON Web Tokens)
- **Docs:** Swagger UI em português
- **Deploy:** Vercel (serverless) ou Docker

---

## ⚡ Quick Start

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL rodando (local ou remoto)
- Git configurado

### 1️⃣ Clonar e Instalar
```bash
git clone <url-do-repositorio>
cd gubi-server
npm install
```

### 2️⃣ Configurar Environment
Copie o arquivo `.env.example` para `.env` e configure:
```bash
cp .env.example .env
```

**Variáveis obrigatórias:**
```env
PORT=3001
DATABASE_URL="postgresql://usuario:senha@host:5432/database"
JWT_SECRET="seu_jwt_secret_aqui"
```

### 3️⃣ Configurar Banco de Dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma db push

# (Opcional) Popular banco com dados de teste
npx prisma db seed
```

### 4️⃣ Executar em Desenvolvimento
```bash
npm run dev
```

✅ **Servidor rodando em:** http://localhost:3001
✅ **Documentação Swagger:** http://localhost:3001/api-docs

---

## 📁 Estrutura do Projeto

```
gubi-server/
├── 📁 src/                    # Código fonte principal
│   ├── 📁 controllers/        # Lógica de negócio
│   ├── 📁 middlewares/        # Middlewares (auth, validação)
│   ├── 📁 routes/             # Definição das rotas
│   ├── 📁 types/              # Tipagens TypeScript
│   ├── 📁 utils/              # Utilitários (email, token)
│   ├── 📄 index.ts            # Ponto de entrada da aplicação
│   └── 📄 swagger.ts          # Configuração do Swagger
├── 📁 prisma/                 # Configuração do banco de dados
│   ├── 📁 migrations/         # Migrações do banco
│   └── 📄 schema.prisma       # Schema do banco de dados
├── 📁 api/                    # Handler para Vercel (serverless)
├── 📁 docs/                   # Documentação técnica
├── 📄 .env                    # Variáveis de ambiente (não commitado)
├── 📄 package.json            # Dependências e scripts
├── 📄 tsconfig.json           # Configuração TypeScript
├── 📄 vercel.json             # Configuração para deploy Vercel
└── 📄 Dockerfile              # Containerização Docker
```

### 🎯 Padrões de Organização

#### Controllers (`src/controllers/`)
- **Propósito:** Contém a lógica de negócio
- **Padrão:** Um controller por domínio (auth, discovery)
- **Exemplo:** `auth.controller.ts` gerencia registro, login, recuperação

#### Routes (`src/routes/`)
- **Propósito:** Define endpoints e liga aos controllers
- **Padrão:** Uma rota por domínio + documentação Swagger inline
- **Exemplo:** `auth.ts` define `/api/v1/auth/*`

#### Middlewares (`src/middlewares/`)
- **Propósito:** Funcionalidades reutilizáveis (auth, validação)
- **Padrão:** Funções que seguem interface `(req, res, next) => {}`

---

## 🗃️ Banco de Dados

### Modelo de Dados
O sistema possui **8 tabelas principais** organizadas em torno do usuário:

```mermaid
graph TD
    A[User] --> B[Interests]
    A --> C[Education]
    A --> D[Employment]
    A --> E[Skills]
    A --> F[Challenges]
    A --> G[Socioeconomic]
    A --> H[Completion]
    A --> I[DiscoveryProgress]
```

### Tabelas Principais

#### 👤 User (Tabela Central)
```sql
id, name, lastName, email, password, country, 
phoneNumber, birthDate, gender, location, profileImageUrl, createdAt
```

#### 🎯 DiscoveryProgress (Sistema Gamificado)
```sql
userId, resume, completedLevels[], answers[]
```

#### 🔒 PasswordReset (Recuperação de Senha)
```sql
id, email, code, expiresAt, used
```

### Comandos Úteis
```bash
# Visualizar dados (interface gráfica)
npx prisma studio

# Resetar banco (CUIDADO!)
npx prisma db push --force-reset

# Gerar cliente após mudanças no schema
npx prisma generate
```

---

## 🔐 Autenticação

### Sistema JWT
- **Token:** Enviado via header `Authorization: Bearer <token>`
- **Expiração:** Configurável via `JWT_SECRET`
- **Middleware:** `authenticateClient` protege rotas

### Fluxo de Autenticação
1. **Registro:** `POST /api/v1/auth/register`
2. **Login:** `POST /api/v1/auth/login` → Retorna JWT
3. **Uso:** Incluir `Authorization: Bearer <token>` nas requisições protegidas

### Recuperação de Senha
1. **Solicitar código:** `POST /api/v1/auth/recovery/send`
2. **Verificar código:** `POST /api/v1/auth/recovery/verify`
3. **Redefinir senha:** `POST /api/v1/auth/recovery/reset`

---

## 📷 Upload de Imagens

### Sistema de Upload
- **Localização:** `/uploads/profiles/{userId}/`
- **Formatos:** JPEG, PNG, WebP
- **Tamanho máximo:** 5MB por arquivo
- **Segurança:** Validação de MIME type e file signatures

### Configuração
```bash
# Estrutura de pastas criada automaticamente
uploads/
  └── profiles/
      └── {userId}/
          └── profile-{userId}-{timestamp}.{ext}
```

### Validações de Segurança
- **MIME Types:** Whitelist de tipos permitidos
- **File Signatures:** Validação de magic numbers
- **Rate Limiting:** Máximo 10 uploads por 15 minutos
- **Sanitização:** Nomes de arquivo seguros

### Uso via API
```bash
# Upload de imagem
curl -X POST http://localhost:3001/api/v1/profile/image \
  -H "Authorization: Bearer {token}" \
  -F "image=@perfil.jpg"

# Remover imagem
curl -X DELETE http://localhost:3001/api/v1/profile/image \
  -H "Authorization: Bearer {token}"
```

---

## 📚 API Endpoints

### 🔐 Autenticação (`/api/v1/auth`)
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/register` | Cadastro de usuário | ❌ |
| POST | `/login` | Login do usuário | ❌ |
| POST | `/check-email` | Verificar se email existe | ❌ |
| POST | `/recovery/send` | Enviar código de recuperação | ❌ |
| POST | `/recovery/verify` | Verificar código | ❌ |
| POST | `/recovery/reset` | Redefinir senha | ❌ |

### 🎮 Discovery (`/api/v1/discovery`)
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/questions/update` | Atualizar progresso | ✅ |
| POST | `/resume/send` | Enviar resumo | ✅ |

### � Perfil (`/api/v1/profile`)
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/` | Buscar perfil completo | ✅ |
| PUT | `/` | Atualizar dados do perfil | ✅ |
| POST | `/image` | Upload de imagem de perfil | ✅ |
| DELETE | `/image` | Remover imagem de perfil | ✅ |

### �📖 Documentação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api-docs` | Interface Swagger em português |

---

## 🧪 Testes

### Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev          # Servidor com hot-reload
npm run build        # Build para produção
npm run start        # Executar versão buildada

# Banco de dados
npm run db:studio    # Interface gráfica Prisma Studio
npm run db:reset     # Resetar banco (CUIDADO!)
npm run db:seed      # Popular com dados de teste
```

### Testando Endpoints
1. **Via Swagger UI:** http://localhost:3001/api-docs
2. **Via Postman/Insomnia:** Importe a collection do Swagger
3. **Via curl:** Exemplos na documentação de cada endpoint

---

## 🚀 Deploy

### Vercel (Recomendado)
1. **Conecte o repositório** no painel da Vercel
2. **Configure as variáveis** de ambiente:
   ```
   DATABASE_URL=sua_url_postgresql
   JWT_SECRET=seu_jwt_secret
   PORT=3001
   ```
3. **Deploy automático** a cada push na branch main

### Docker
```bash
# Build da imagem
docker build -t gubi-server .

# Executar container
docker run -p 3001:3001 --env-file .env gubi-server
```

### Outras Opções
- **Render:** Deploy direto via GitHub
- **Railway:** Suporte completo a PostgreSQL
- **Fly.io:** Deploy via CLI

---

## 📖 Guias Avançados

### 🔧 Adicionando Novos Endpoints

1. **Criar controller** em `src/controllers/`
2. **Criar rota** em `src/routes/` com documentação Swagger
3. **Registrar rota** no `src/index.ts`
4. **Testar** via `/api-docs`

### 📊 Modificando o Banco
1. **Alterar** `prisma/schema.prisma`
2. **Gerar migração:** `npx prisma migrate dev --name descricao`
3. **Aplicar:** `npx prisma db push`
4. **Regenerar cliente:** `npx prisma generate`

### 🔐 Adicionando Middleware
```typescript
// src/middlewares/exemplo.middleware.ts
export const exemploMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Sua lógica aqui
  next();
};
```

---

## 🆘 Troubleshooting

### Problemas Comuns

#### ❌ "Cannot connect to database"
- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`
- Teste conexão: `npx prisma db pull`

#### ❌ "JWT malformed"
- Verifique se o `JWT_SECRET` está configurado
- Confirme formato do header: `Authorization: Bearer <token>`

#### ❌ "Port already in use"
- Altere a `PORT` no `.env`
- Finalize processos: `lsof -ti:3001 | xargs kill -9`

### 📞 Suporte
- **Documentação:** http://localhost:3001/api-docs
- **Issues:** Abra um issue no repositório
- **Logs:** Verifique o console para erros detalhados

---

**✨ Pronto para contribuir! Em caso de dúvidas, consulte os arquivos específicos em `/docs/`**
