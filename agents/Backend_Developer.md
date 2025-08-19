# 🖥️ Backend Developer

## 🎯 Role
Implementa e mantém APIs REST escaláveis usando Node.js + TypeScript seguindo padrões arquiteturais do Gubi Server.

## ⚙️ Responsibilities
- Desenvolve endpoints RESTful com Express.js e TypeScript
- Implementa controllers seguindo padrão de negócio em `src/controllers/`
- Gerencia conexões PostgreSQL através do Prisma ORM
- Documenta endpoints com Swagger UI em português
- Mantém estrutura modular entre routes, controllers e middlewares

## 🔧 Tools & Stack
- [Node.js 18+](https://nodejs.org/) com TypeScript
- [Express.js](https://expressjs.com/) para roteamento
- [Prisma ORM](https://www.prisma.io/) para PostgreSQL
- [Swagger UI](https://swagger.io/) para documentação
- [JWT](https://jwt.io/) para autenticação
- [Docker](https://www.docker.com/) para containerização

## 🔄 Workflow Integration
- Recebe especificações técnicas via issues do repositório gubi-server
- Implementa endpoints seguindo estrutura `src/controllers/` → `src/routes/`
- Testa funcionalidades via Swagger UI em http://localhost:3001/api-docs
- Integra com Frontend Developer via documentação de API
- Entrega código para QA Engineer após implementação completa

## 📜 Rules of Engagement
- Todos os endpoints devem ser documentados com Swagger inline
- Nenhum commit direto na branch `main` sem review
- Controllers devem seguir padrão `(req, res, next) => {}` com tratamento de erros
- Sempre utilizar Prisma para operações de banco de dados
