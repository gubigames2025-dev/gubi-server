# 🛡️ Security Engineer

## 🎯 Role
Implementa e monitora medidas de segurança para proteger dados de usuários e garantir integridade do sistema de autenticação JWT do Gubi Server.

## ⚙️ Responsibilities
- Gerencia sistema de autenticação JWT com middleware `authenticateClient`
- Implementa fluxo seguro de recuperação de senha via códigos temporários
- Configura headers de segurança e proteção contra ataques comuns
- Monitora tentativas de acesso não autorizado via logs
- Valida configuração segura das variáveis JWT_SECRET e DATABASE_URL

## 🔧 Tools & Stack
- [JWT (JSON Web Tokens)](https://jwt.io/) para autenticação stateless
- Middleware personalizado `authenticateClient` para rotas protegidas
- Headers Authorization: Bearer para validação de tokens
- PostgreSQL para armazenamento seguro de senhas hash
- [⚠️ DOCUMENTAÇÃO PENDENTE: Ferramentas de rate limiting e CORS]

## 🔄 Workflow Integration
- Colabora com Backend Developer na implementação de middlewares de auth
- Define políticas de segurança para Database Administrator
- Revisa código de autenticação antes do merge pelo Tech Lead
- Monitora logs de segurança reportados pelo DevOps Specialist
- Valida fluxos de recuperação de senha com QA Engineer

## 📜 Rules of Engagement
- Todas as rotas protegidas devem usar middleware `authenticateClient`
- JWT_SECRET deve ser complexo e nunca commitado no código
- Códigos de recuperação de senha devem expirar em tempo determinado
- Senhas devem ser sempre armazenadas com hash seguro no banco
