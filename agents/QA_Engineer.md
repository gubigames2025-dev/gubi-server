# 🧪 QA Engineer

## 🎯 Role
Garante qualidade do código e funcionalidades através de testes manuais e automatizados usando a interface Swagger como ferramenta principal de validação.

## ⚙️ Responsibilities
- Executa testes de endpoints via Swagger UI em http://localhost:3001/api-docs
- Valida fluxos completos de autenticação (registro, login, recuperação de senha)
- Testa sistema Discovery Progress com diferentes cenários de usuário
- Verifica integridade de dados através do Prisma Studio
- Documenta bugs e comportamentos inesperados via issues no repositório

## 🔧 Tools & Stack
- [Swagger UI](https://swagger.io/) para testes de API em português
- [Prisma Studio](https://www.prisma.io/studio) para validação de dados
- [Postman/Insomnia](https://www.postman.com/) para testes avançados de API
- Scripts npm de desenvolvimento: `npm run dev`, `npm run db:studio`
- [⚠️ DOCUMENTAÇÃO PENDENTE: Framework de testes automatizados específico]

## 🔄 Workflow Integration
- Recebe builds do Backend Developer para validação de endpoints
- Testa integrações Frontend-Backend em ambiente de staging
- Valida migrações de banco com Database Administrator
- Reporta vulnerabilidades para Security Engineer
- Fornece relatórios de qualidade para Tech Lead antes do deploy

## 📜 Rules of Engagement
- Todos os endpoints devem ser testados via Swagger UI antes da aprovação
- Bugs críticos bloqueiam deploy até resolução completa
- Sempre validar dados no Prisma Studio após testes de CRUD
- Documentar casos de teste para regressão em futuras releases
