# 🔐 Documentação de Autenticação

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Sistema JWT](#sistema-jwt)
- [Fluxos de Autenticação](#fluxos-de-autenticação)
- [Endpoints](#endpoints)
- [Middleware de Autenticação](#middleware-de-autenticação)
- [Recuperação de Senha](#recuperação-de-senha)
- [Segurança](#segurança)
- [Exemplos Práticos](#exemplos-práticos)

---

## Visão Geral

O sistema de autenticação do Gubi utiliza **JSON Web Tokens (JWT)** para gerenciar sessões de usuário de forma stateless e segura.

### Características
- 🔐 **JWT-based** - Tokens assinados e verificáveis
- 🔒 **Senha hasheada** - Bcrypt para proteção
- 📧 **Recuperação via email** - Sistema de códigos temporários
- 🛡️ **Middleware de proteção** - Rotas protegidas automaticamente
- ⏰ **Tokens com expiração** - Segurança adicional

---

## Sistema JWT

### Estrutura do Token
```javascript
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "userId": 123,
  "email": "usuario@email.com",
  "iat": 1692364800,
  "exp": 1692451200
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

### Configuração
No arquivo `.env`:
```env
JWT_SECRET="sua_chave_secreta_muito_forte_aqui"
```

⚠️ **IMPORTANTE:** Use uma chave forte (mínimo 32 caracteres) em produção.

---

## Fluxos de Autenticação

### 1️⃣ Registro de Usuário
```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as API
    participant D as Database

    C->>A: POST /auth/register
    Note over C,A: { name, lastName, email, password }
    
    A->>D: Verificar se email existe
    alt Email já existe
        D->>A: Email encontrado
        A->>C: 409 Conflict
    else Email disponível
        D->>A: Email disponível
        A->>A: Hash da senha (bcrypt)
        A->>D: Criar usuário
        D->>A: Usuário criado
        A->>A: Gerar JWT
        A->>C: 201 Created + JWT
    end
```

### 2️⃣ Login
```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as API
    participant D as Database

    C->>A: POST /auth/login
    Note over C,A: { email, password }
    
    A->>D: Buscar usuário por email
    alt Usuário não encontrado
        D->>A: Não encontrado
        A->>C: 401 Unauthorized
    else Usuário encontrado
        D->>A: Dados do usuário
        A->>A: Verificar senha (bcrypt)
        alt Senha incorreta
            A->>C: 401 Unauthorized
        else Senha correta
            A->>A: Gerar JWT
            A->>C: 200 OK + JWT
        end
    end
```

### 3️⃣ Acesso a Rota Protegida
```mermaid
sequenceDiagram
    participant C as Cliente
    participant M as Middleware
    participant R as Rota

    C->>M: Request com Authorization header
    Note over C,M: Authorization: Bearer <token>
    
    M->>M: Extrair token do header
    alt Token ausente/inválido
        M->>C: 401 Unauthorized
    else Token válido
        M->>M: Verificar assinatura JWT
        M->>M: Decodificar payload
        M->>R: next() - Continuar para rota
        Note over M,R: req.user = { userId, email }
        R->>C: Resposta da rota
    end
```

---

## Endpoints

### 🔐 POST `/api/v1/auth/register`
**Descrição:** Cadastro de novo usuário

#### Request
```json
{
  "name": "João",
  "lastName": "Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "country": "Brasil",
  "phoneNumber": "+5511999999999",
  "birthDate": "1990-01-15",
  "gender": "masculino",
  "location": "São Paulo"
}
```

#### Responses
```json
// ✅ 201 Created
{
  "message": "Usuário criado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "João",
    "email": "joao@email.com"
  }
}

// ❌ 409 Conflict (email já existe)
{
  "error": "Email já está em uso"
}

// ❌ 400 Bad Request (dados inválidos)
{
  "error": "Dados obrigatórios ausentes",
  "fields": ["name", "password"]
}
```

### 🔑 POST `/api/v1/auth/login`
**Descrição:** Login do usuário

#### Request
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Responses
```json
// ✅ 200 OK
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "João",
    "email": "joao@email.com"
  }
}

// ❌ 401 Unauthorized
{
  "error": "Credenciais inválidas"
}
```

### ✉️ POST `/api/v1/auth/check-email`
**Descrição:** Verificar se email está disponível

#### Request
```json
{
  "email": "joao@email.com"
}
```

#### Responses
```json
// Email disponível
{
  "available": true,
  "message": "Email disponível"
}

// Email já cadastrado
{
  "available": false,
  "message": "Email já está em uso"
}
```

---

## Middleware de Autenticação

### Implementação (`src/middlewares/auth.middleware.ts`)
```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const authenticateClient = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Uso em Rotas
```typescript
import { authenticateClient } from '../middlewares/auth.middleware';

// Rota protegida
router.post('/protected-route', authenticateClient, (req, res) => {
  // req.user está disponível aqui
  const { userId, email } = req.user;
  res.json({ message: `Olá ${email}` });
});
```

---

## Recuperação de Senha

### Fluxo Completo
```mermaid
sequenceDiagram
    participant U as Usuário
    participant A as API
    participant E as Email Service
    participant D as Database

    U->>A: POST /auth/recovery/send
    A->>D: Verificar se email existe
    A->>A: Gerar código (6 dígitos)
    A->>D: Salvar código com expiração
    A->>E: Enviar email com código
    A->>U: 200 - Código enviado

    U->>A: POST /auth/recovery/verify
    A->>D: Verificar código e validade
    A->>U: 200 - Código válido

    U->>A: POST /auth/recovery/reset
    A->>D: Verificar código novamente
    A->>A: Hash da nova senha
    A->>D: Atualizar senha do usuário
    A->>D: Marcar código como usado
    A->>U: 200 - Senha alterada
```

### 1️⃣ Solicitar Código
**Endpoint:** `POST /api/v1/auth/recovery/send`

```json
// Request
{
  "email": "joao@email.com"
}

// Response
{
  "message": "Código de recuperação enviado para o email"
}
```

### 2️⃣ Verificar Código
**Endpoint:** `POST /api/v1/auth/recovery/verify`

```json
// Request
{
  "email": "joao@email.com",
  "code": "123456"
}

// Response - Sucesso
{
  "message": "Código válido",
  "valid": true
}

// Response - Erro
{
  "error": "Código inválido ou expirado",
  "valid": false
}
```

### 3️⃣ Redefinir Senha
**Endpoint:** `POST /api/v1/auth/recovery/reset`

```json
// Request
{
  "email": "joao@email.com",
  "code": "123456",
  "password": "novaSenha123"
}

// Response
{
  "message": "Senha redefinida com sucesso"
}
```

### Configuração de Email
No arquivo `.env`:
```env
# Configurações SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app

# Ou usando serviços como SendGrid, Mailgun, etc.
SENDGRID_API_KEY=sua_api_key
```

---

## Segurança

### 🛡️ Boas Práticas Implementadas

#### Hashing de Senhas
```typescript
import bcrypt from 'bcrypt';

// No registro
const hashedPassword = await bcrypt.hash(password, 10);

// No login
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### Validação de Token
```typescript
// Verificação rigorosa
const decoded = jwt.verify(token, JWT_SECRET);

// Verificação de expiração automática
// JWT automaticamente rejeita tokens expirados
```

#### Rate Limiting (Recomendado)
```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: 'Muitas tentativas de login'
});

router.post('/login', authLimiter, loginController);
```

### 🔒 Configurações de Produção

#### Headers de Segurança
```typescript
import helmet from 'helmet';
app.use(helmet());
```

#### CORS Configurado
```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
```

#### HTTPS Only
```typescript
// Redirecionar HTTP para HTTPS em produção
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## Exemplos Práticos

### 🌐 Frontend - JavaScript
```javascript
// Registro
const register = async (userData) => {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Salvar token
    localStorage.setItem('token', data.token);
    return data;
  } else {
    throw new Error(data.error);
  }
};

// Fazer requisição autenticada
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
};

// Uso
const response = await makeAuthenticatedRequest('/api/v1/discovery/progress');
```

### 📱 cURL
```bash
# Registro
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "lastName": "Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'

# Requisição autenticada
curl -X POST http://localhost:3001/api/v1/discovery/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"answers": ["resposta1", "resposta2"]}'
```

### 🧪 Teste com Postman
1. **Configurar Environment:**
   - `base_url`: http://localhost:3001
   - `token`: (será preenchido automaticamente)

2. **Request de Login:**
   - POST `{{base_url}}/api/v1/auth/login`
   - Body: JSON com email e senha
   - Test script:
   ```javascript
   if (pm.response.code === 200) {
       const data = pm.response.json();
       pm.environment.set('token', data.token);
   }
   ```

3. **Requests Autenticadas:**
   - Header: `Authorization: Bearer {{token}}`

---

## 🔧 Troubleshooting

### Problemas Comuns

#### ❌ "JWT malformed"
```javascript
// Verifique se o token está sendo enviado corretamente
const token = authHeader.substring(7); // Remove "Bearer "

// Verifique se não há espaços extras
console.log('Token:', `"${token}"`);
```

#### ❌ "Token não fornecido"
```javascript
// Verifique o header Authorization
console.log('Auth header:', req.headers.authorization);

// Formato esperado: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### ❌ "User not found"
```javascript
// Verifique se o userId no token é válido
const user = await prisma.user.findUnique({
  where: { id: req.user.userId }
});

if (!user) {
  return res.status(404).json({ error: 'Usuário não encontrado' });
}
```

### Debug Mode
```typescript
// Adicione logs para debug
console.log('Token payload:', decoded);
console.log('User from request:', req.user);

// Verifique expiração manualmente
const now = Math.floor(Date.now() / 1000);
console.log('Token expires at:', decoded.exp);
console.log('Current time:', now);
console.log('Is expired:', now > decoded.exp);
```

---

**🔐 Lembre-se:** Sempre use HTTPS em produção e mantenha o `JWT_SECRET` seguro!
