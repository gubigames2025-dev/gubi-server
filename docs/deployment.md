# 🚀 Guia de Deploy

## 📋 Índice
- [Opções de Deploy](#opções-de-deploy)
- [Deploy na Vercel (Recomendado)](#deploy-na-vercel-recomendado)
- [Deploy no Render](#deploy-no-render)
- [Deploy no Railway](#deploy-no-railway)
- [Deploy com Docker](#deploy-com-docker)
- [Configuração de Banco de Dados](#configuração-de-banco-de-dados)
- [Monitoramento e Logs](#monitoramento-e-logs)
- [Troubleshooting](#troubleshooting)

---

## Opções de Deploy

### 🌟 Recomendadas (Gratuitas)
| Plataforma | Tipo | Prós | Contras |
|------------|------|------|---------|
| **Vercel** | Serverless | Deploy automático, SSL grátis, CDN | Limite de execução, cold starts |
| **Render** | Container | Sempre ativo, fácil configuração | Sleep após inatividade |
| **Railway** | Container | PostgreSQL incluído, simples | Limite de horas/mês |

### 🏢 Produção (Pagas)
| Plataforma | Tipo | Prós | Contras |
|------------|------|------|---------|
| **Heroku** | Container | Maduro, add-ons | Mais caro, sem plano grátis |
| **DigitalOcean** | VPS | Controle total, previsível | Requer configuração manual |
| **AWS/GCP** | Cloud | Escalável, confiável | Complexidade, custos variáveis |

---

## Deploy na Vercel (Recomendado)

### ✅ Pré-requisitos
- Conta no GitHub/GitLab/Bitbucket
- Projeto já adaptado para Vercel (arquivo `api/index.ts` e `vercel.json`)
- Banco de dados PostgreSQL acessível externamente

### 🔧 Passo a Passo

#### 1️⃣ Preparar o Repositório
```bash
# Fazer commit de todas as mudanças
git add .
git commit -m "feat: preparar para deploy na Vercel"

# Push para o repositório
git push origin main
```

#### 2️⃣ Conectar na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"New Project"**
4. Selecione o repositório `gubi-server`
5. Clique em **"Import"**

#### 3️⃣ Configurar Variáveis de Ambiente
Na tela de configuração do projeto, adicione:

```env
DATABASE_URL=postgresql://gubi_admin:senha@host:5432/gubi_db
JWT_SECRET=sua_chave_secreta_muito_forte_aqui
NODE_ENV=production
```

⚠️ **IMPORTANTE:** Use uma chave JWT diferente da de desenvolvimento!

#### 4️⃣ Deploy
1. Clique em **"Deploy"**
2. Aguarde o build e deploy (2-5 minutos)
3. Acesse a URL fornecida (ex: `https://gubi-server.vercel.app`)

#### 5️⃣ Testar
```bash
# Testar API
curl https://seu-app.vercel.app/api/v1/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@email.com"}'

# Acessar documentação
# Abra: https://seu-app.vercel.app/api-docs
```

### 🔄 Deploy Automático
- Todo push na branch `main` dispara deploy automático
- Preview deployments para outras branches
- Rollback fácil via interface web

### ⚙️ Configurações Avançadas
```json
// vercel.json (já configurado)
{
  "version": 2,
  "builds": [
    { "src": "api/index.ts", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "api/index.ts" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## Deploy no Render

### 🔧 Configuração

#### 1️⃣ Criar Web Service
1. Acesse [render.com](https://render.com)
2. Conecte seu repositório GitHub
3. Escolha **"Web Service"**
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18

#### 2️⃣ Variáveis de Ambiente
```env
DATABASE_URL=sua_database_url_aqui
JWT_SECRET=sua_chave_jwt_secreta
NODE_ENV=production
PORT=10000
```

#### 3️⃣ Ajustar package.json
```json
{
  "scripts": {
    "build": "tsc && npx prisma generate",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  }
}
```

### 🔄 Deploy
- Deploy automático a cada push
- Logs em tempo real
- SSL automático

---

## Deploy no Railway

### 🚄 Configuração

#### 1️⃣ Conectar Projeto
1. Acesse [railway.app](https://railway.app)
2. Clique **"Deploy from GitHub repo"**
3. Selecione o repositório

#### 2️⃣ Adicionar PostgreSQL
1. Clique **"+ New"** > **"PostgreSQL"**
2. Railway automaticamente cria `DATABASE_URL`

#### 3️⃣ Configurar Variáveis
Railway detecta automaticamente, mas adicione:
```env
JWT_SECRET=sua_chave_jwt_secreta
NODE_ENV=production
```

#### 4️⃣ Script de Build
```json
{
  "scripts": {
    "build": "tsc && npx prisma generate && npx prisma db push",
    "start": "node dist/index.js"
  }
}
```

---

## Deploy com Docker

### 🐳 Dockerfile (já configurado)
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build
RUN npx prisma generate

# Expor porta
EXPOSE 3001

# Comando de inicialização
CMD ["npm", "start"]
```

### 🏃‍♂️ Build e Run Local
```bash
# Build da imagem
docker build -t gubi-server .

# Executar container
docker run -d \
  --name gubi-server \
  -p 3001:3001 \
  --env-file .env \
  gubi-server

# Ver logs
docker logs gubi-server

# Parar container
docker stop gubi-server
```

### 📦 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: gubi_db
      POSTGRES_USER: gubi_user
      POSTGRES_PASSWORD: gubi_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Executar stack completa
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

---

## Configuração de Banco de Dados

### 🐘 PostgreSQL na Nuvem (Gratuito)

#### Neon (Recomendado)
1. Acesse [neon.tech](https://neon.tech)
2. Crie conta e novo projeto
3. Copie a connection string
4. Configure `DATABASE_URL`

#### Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Novo projeto
3. Copie a connection string PostgreSQL
4. Configure `DATABASE_URL`

#### ElephantSQL
1. Acesse [elephantsql.com](https://elephantsql.com)
2. Plano gratuito "Tiny Turtle"
3. Copie a URL de conexão

### 🔧 Migração para Produção
```bash
# Aplicar schema no banco de produção
npx prisma db push

# Ou aplicar migrações específicas
npx prisma migrate deploy

# Verificar estrutura
npx prisma db pull
```

### 📊 Backup e Restore
```bash
# Backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20250818.sql
```

---

## Monitoramento e Logs

### 📊 Vercel
- **Analytics:** Painel de requisições e performance
- **Logs:** Logs de função serverless em tempo real
- **Metrics:** Bandwidth, executions, errors

```bash
# Ver logs via CLI
npx vercel logs https://seu-app.vercel.app
```

### 📈 Render
- **Metrics:** CPU, memory, response times
- **Logs:** Stream em tempo real
- **Health Checks:** Configuráveis

### 🚄 Railway
- **Observability:** Métricas integradas
- **Logs:** Interface clean
- **Metrics:** CPU, RAM, network

### 🐳 Docker + Monitoring
```yaml
# docker-compose.yml com monitoring
services:
  app:
    # ... configuração do app

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

---

## Troubleshooting

### 🐛 Problemas Comuns

#### ❌ "Cannot connect to database"
```bash
# Verificar conexão
psql $DATABASE_URL -c "SELECT 1;"

# Aplicar migrations
npx prisma db push

# Gerar cliente
npx prisma generate
```

#### ❌ "Module not found" no build
```bash
# Verificar dependências
npm ci

# Build local para testar
npm run build

# Verificar se dist/ foi criado
ls -la dist/
```

#### ❌ "Port already in use" (Docker)
```bash
# Ver portas ocupadas
lsof -i :3001

# Parar containers
docker stop $(docker ps -q)

# Usar porta diferente
docker run -p 3002:3001 gubi-server
```

#### ❌ "JWT Secret not set"
```bash
# Verificar variáveis de ambiente
printenv | grep JWT_SECRET

# No Vercel: verificar na dashboard
# No Docker: verificar .env ou -e JWT_SECRET=...
```

### 🔍 Debug em Produção

#### Logs Estruturados
```typescript
// Adicionar em src/index.ts
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log = (message: any, ...args: any[]) => {
    console.info(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...args
    }));
  };
}
```

#### Health Check Endpoint
```typescript
// Adicionar em src/routes/
app.get('/health', async (req, res) => {
  try {
    // Testar conexão com banco
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

#### Environment Info Endpoint (Dev only)
```typescript
app.get('/debug/env', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' });
  }
  
  res.json({
    nodeVersion: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV,
    databaseConnected: !!process.env.DATABASE_URL,
    jwtConfigured: !!process.env.JWT_SECRET,
    port: process.env.PORT || 3001
  });
});
```

---

## 🚀 Deploy Checklist

### ✅ Antes do Deploy
- [ ] Testar aplicação localmente (`npm run build && npm start`)
- [ ] Configurar variáveis de ambiente para produção
- [ ] Usar JWT_SECRET forte e único
- [ ] Configurar DATABASE_URL para produção
- [ ] Testar conexão com banco de produção
- [ ] Fazer backup do banco (se existir dados)
- [ ] Revisar logs de erro no código

### ✅ Durante o Deploy
- [ ] Monitorar logs de build
- [ ] Verificar se dependências foram instaladas
- [ ] Confirmar se migrations foram aplicadas
- [ ] Testar endpoint básico (`/health` ou `/api-docs`)

### ✅ Após o Deploy
- [ ] Testar todos os endpoints principais
- [ ] Verificar se documentação Swagger funciona
- [ ] Testar fluxo completo de autenticação
- [ ] Configurar monitoramento/alertas
- [ ] Documenter URLs de produção
- [ ] Configurar domínio customizado (opcional)

---

**🎉 Pronto! Sua API está no ar e pronta para uso!**

Para mais ajuda com deploy, consulte a documentação específica de cada plataforma ou abra uma issue no repositório.
