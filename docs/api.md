# 📚 Documentação da API

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Endpoints de Autenticação](#endpoints-de-autenticação)
- [Endpoints do Discovery](#endpoints-do-discovery)
- [Códigos de Status](#códigos-de-status)
- [Swagger UI](#swagger-ui)
- [Exemplos de Uso](#exemplos-de-uso)

---

## Visão Geral

A API do Gubi é uma REST API que oferece endpoints para:

- 🔐 **Autenticação completa** (registro, login, recuperação de senha)
- 🎮 **Sistema Discovery** (progresso gamificado)
- 📖 **Documentação interativa** via Swagger

### Base URL
```
# Desenvolvimento
http://localhost:3001

# Produção (Vercel)
https://seu-app.vercel.app
```

### Content-Type
Todas as requisições e respostas utilizam:
```
Content-Type: application/json
```

---

## Autenticação

### 🔑 JWT Bearer Token
Rotas protegidas requerem header de autorização:
```
Authorization: Bearer <seu_jwt_token>
```

### 🔓 Rotas Públicas
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/check-email`
- `POST /api/v1/auth/recovery/*`
- `GET /api-docs` (Swagger)

### 🔒 Rotas Protegidas
- `POST /api/v1/discovery/questions/update`
- `POST /api/v1/discovery/resume/send`

---

## Endpoints de Autenticação

### 🆕 Registro de Usuário
```http
POST /api/v1/auth/register
```

#### Parâmetros
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | ✅ | Nome do usuário |
| `lastName` | string | ✅ | Sobrenome |
| `email` | string | ✅ | Email único |
| `password` | string | ✅ | Senha (min. 6 caracteres) |
| `country` | string | ✅ | País |
| `phoneNumber` | string | ✅ | Telefone |
| `birthDate` | string | ✅ | Data nascimento (ISO 8601) |
| `gender` | string | ✅ | Gênero |
| `customGender` | string | ❌ | Gênero personalizado |
| `location` | string | ✅ | Localização |

#### Exemplo de Requisição
```json
{
  "name": "João",
  "lastName": "Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "country": "Brasil",
  "phoneNumber": "+5511999999999",
  "birthDate": "1990-01-15T00:00:00.000Z",
  "gender": "masculino",
  "location": "São Paulo"
}
```

#### Respostas
```json
// ✅ 201 - Sucesso
{
  "message": "Usuário criado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "João",
    "lastName": "Silva",
    "email": "joao@email.com"
  }
}

// ❌ 409 - Email já existe
{
  "error": "Email já está em uso"
}

// ❌ 400 - Dados inválidos
{
  "error": "Dados obrigatórios ausentes",
  "fields": ["name", "password"]
}
```

---

### 🔑 Login
```http
POST /api/v1/auth/login
```

#### Parâmetros
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `email` | string | ✅ | Email do usuário |
| `password` | string | ✅ | Senha |

#### Exemplo de Requisição
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Respostas
```json
// ✅ 200 - Sucesso
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "João",
    "email": "joao@email.com"
  }
}

// ❌ 401 - Credenciais inválidas
{
  "error": "Credenciais inválidas"
}
```

---

### ✉️ Verificar Email
```http
POST /api/v1/auth/check-email
```

#### Parâmetros
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `email` | string | ✅ | Email a verificar |

#### Exemplo de Requisição
```json
{
  "email": "joao@email.com"
}
```

#### Respostas
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

### 🔄 Recuperação de Senha

#### 1️⃣ Solicitar Código
```http
POST /api/v1/auth/recovery/send
```

**Parâmetros:**
```json
{
  "email": "joao@email.com"
}
```

**Resposta:**
```json
{
  "message": "Código de recuperação enviado para o email"
}
```

#### 2️⃣ Verificar Código
```http
POST /api/v1/auth/recovery/verify
```

**Parâmetros:**
```json
{
  "email": "joao@email.com",
  "code": "123456"
}
```

**Respostas:**
```json
// Código válido
{
  "message": "Código válido",
  "valid": true
}

// Código inválido
{
  "error": "Código inválido ou expirado",
  "valid": false
}
```

#### 3️⃣ Redefinir Senha
```http
POST /api/v1/auth/recovery/reset
```

**Parâmetros:**
```json
{
  "email": "joao@email.com",
  "code": "123456",
  "password": "novaSenha123"
}
```

**Resposta:**
```json
{
  "message": "Senha redefinida com sucesso"
}
```

---

## Endpoints do Discovery

### 🎮 Atualizar Progresso
```http
POST /api/v1/discovery/questions/update
Authorization: Bearer <token>
```

#### Parâmetros
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `answers` | string[] | ✅ | Array de respostas do usuário |
| `completedLevels` | string[] | ❌ | Níveis completados |

#### Exemplo de Requisição
```json
{
  "answers": [
    "Tenho interesse em tecnologia",
    "Prefiro trabalhar em equipe",
    "Gosto de resolver problemas complexos"
  ],
  "completedLevels": ["library", "florest"]
}
```

#### Respostas
```json
// ✅ 200 - Sucesso
{
  "message": "Progresso atualizado com sucesso",
  "progress": {
    "id": 456,
    "userId": 123,
    "answers": ["..."],
    "completedLevels": ["library", "florest"],
    "progressPercentage": 75.5
  }
}

// ❌ 401 - Não autorizado
{
  "error": "Token inválido ou expirado"
}

// ❌ 400 - Dados inválidos
{
  "error": "Respostas são obrigatórias",
  "field": "answers"
}
```

---

### 📄 Enviar Resumo
```http
POST /api/v1/discovery/resume/send
Authorization: Bearer <token>
```

#### Parâmetros
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `resume` | string | ✅ | Resumo gerado pelo sistema |

#### Exemplo de Requisição
```json
{
  "resume": "Baseado nas suas respostas, você demonstra forte interesse em tecnologia e habilidades de resolução de problemas. Recomendamos explorar carreiras em desenvolvimento de software ou análise de dados."
}
```

#### Respostas
```json
// ✅ 200 - Sucesso
{
  "message": "Resumo salvo com sucesso",
  "resumeId": 789,
  "characterCount": 245
}

// ❌ 401 - Não autorizado
{
  "error": "Token inválido ou expirado"
}
```

---

## Códigos de Status

### ✅ Sucesso
| Código | Descrição | Uso |
|--------|-----------|-----|
| `200` | OK | Operação realizada com sucesso |
| `201` | Created | Recurso criado com sucesso |

### ❌ Erro do Cliente
| Código | Descrição | Uso |
|--------|-----------|-----|
| `400` | Bad Request | Dados inválidos ou ausentes |
| `401` | Unauthorized | Token inválido ou ausente |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Recurso já existe (ex: email duplicado) |
| `422` | Unprocessable Entity | Dados válidos, mas não processáveis |

### 🔥 Erro do Servidor
| Código | Descrição | Uso |
|--------|-----------|-----|
| `500` | Internal Server Error | Erro interno do servidor |
| `503` | Service Unavailable | Serviço temporariamente indisponível |

### Estrutura de Erro Padrão
```json
{
  "error": "Mensagem descritiva do erro",
  "code": "ERROR_CODE",
  "field": "campo_com_erro", // quando aplicável
  "timestamp": "2025-08-18T10:30:00.000Z"
}
```

---

## Swagger UI

### 📖 Acessar Documentação
```
GET /api-docs
```

A documentação interativa Swagger está disponível em português e permite:
- 🧪 **Testar endpoints** diretamente no navegador
- 📋 **Ver exemplos** de requisição e resposta
- 🔍 **Explorar esquemas** de dados
- 📝 **Copiar código** para diferentes linguagens

### Recursos da Interface
- **Try it out:** Executar requisições reais
- **Authorize:** Configurar token JWT uma vez para todos os endpoints
- **Models:** Ver estrutura completa dos objetos de dados
- **Download:** Baixar especificação OpenAPI em JSON/YAML

---

## Exemplos de Uso

### 🌐 JavaScript (Frontend)
```javascript
class GubiAPI {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('gubi_token');
  }

  // Configurar token após login
  setToken(token) {
    this.token = token;
    localStorage.setItem('gubi_token', token);
  }

  // Fazer requisição com autenticação
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Adicionar token se disponível
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  }

  // Métodos específicos
  async register(userData) {
    const data = await this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    this.setToken(data.token);
    return data;
  }

  async updateDiscoveryProgress(answers) {
    return this.request('/api/v1/discovery/questions/update', {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }

  async sendResume(resume) {
    return this.request('/api/v1/discovery/resume/send', {
      method: 'POST',
      body: JSON.stringify({ resume })
    });
  }
}

// Uso
const api = new GubiAPI();

try {
  // Fazer login
  const loginData = await api.login('joao@email.com', 'senha123');
  console.log('Login realizado:', loginData.user.name);

  // Atualizar progresso
  const progress = await api.updateDiscoveryProgress([
    'Resposta 1',
    'Resposta 2',
    'Resposta 3'
  ]);
  console.log('Progresso atualizado:', progress);

} catch (error) {
  console.error('Erro:', error.message);
}
```

### 🐍 Python
```python
import requests
import json

class GubiAPI:
    def __init__(self, base_url='http://localhost:3001'):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def set_token(self, token):
        self.token = token
        self.session.headers.update({'Authorization': f'Bearer {token}'})

    def request(self, method, endpoint, data=None):
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.HTTPError as e:
            error_data = response.json() if response.content else {'error': str(e)}
            raise Exception(error_data.get('error', 'Erro na requisição'))

    def register(self, user_data):
        data = self.request('POST', '/api/v1/auth/register', user_data)
        self.set_token(data['token'])
        return data

    def login(self, email, password):
        data = self.request('POST', '/api/v1/auth/login', {
            'email': email,
            'password': password
        })
        self.set_token(data['token'])
        return data

    def update_discovery_progress(self, answers):
        return self.request('POST', '/api/v1/discovery/questions/update', {
            'answers': answers
        })

# Uso
api = GubiAPI()

try:
    # Login
    login_data = api.login('joao@email.com', 'senha123')
    print(f"Login realizado: {login_data['user']['name']}")

    # Atualizar progresso
    progress = api.update_discovery_progress([
        'Resposta 1',
        'Resposta 2',
        'Resposta 3'
    ])
    print(f"Progresso atualizado: {progress}")

except Exception as error:
    print(f"Erro: {error}")
```

### 📱 React Hook
```typescript
import { useState, useCallback } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('gubi_token'),
    loading: false
  });

  const apiRequest = useCallback(async (
    endpoint: string, 
    options: RequestInit = {}
  ) => {
    const response = await fetch(`/api/v1${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authState.token && { 
          Authorization: `Bearer ${authState.token}` 
        }),
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  }, [authState.token]);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('gubi_token', data.token);
      setAuthState({
        user: data.user,
        token: data.token,
        loading: false
      });

      return data;
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [apiRequest]);

  const logout = useCallback(() => {
    localStorage.removeItem('gubi_token');
    setAuthState({ user: null, token: null, loading: false });
  }, []);

  return {
    ...authState,
    login,
    logout,
    apiRequest
  };
};

// Uso no componente
function LoginForm() {
  const { login, loading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      alert('Login realizado com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  if (user) {
    return <div>Bem-vindo, {user.name}!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

---

## 🧪 Testando a API

### Postman Collection
```json
{
  "info": {
    "name": "Gubi API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth - Login",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"teste@email.com\",\n  \"password\": \"senha123\"\n}"
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 200) {",
              "    const data = pm.response.json();",
              "    pm.environment.set('token', data.token);",
              "}"
            ]
          }
        }
      ]
    }
  ]
}
```

### cURL Examples
```bash
# Registro
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "lastName": "Usuario",
    "email": "teste@email.com",
    "password": "senha123",
    "country": "Brasil",
    "phoneNumber": "+5511999999999",
    "birthDate": "1990-01-01T00:00:00.000Z",
    "gender": "masculino",
    "location": "São Paulo"
  }'

# Login (salve o token da resposta)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123"
  }'

# Requisição autenticada
curl -X POST http://localhost:3001/api/v1/discovery/questions/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "answers": ["resposta 1", "resposta 2", "resposta 3"]
  }'
```

---

**📚 Para mais detalhes, acesse a documentação interativa em `/api-docs`**
