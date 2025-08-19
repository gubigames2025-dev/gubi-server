# 🗃️ Database Administrator

## 🎯 Role
Gerencia o banco PostgreSQL e mantém o schema Prisma, garantindo integridade dos dados e performance das queries do sistema Gubi.

## ⚙️ Responsibilities
- Mantém schema.prisma com 8 tabelas principais organizadas em torno do User
- Executa migrações via `npx prisma migrate dev` de forma segura
- Monitora performance do PostgreSQL através do Prisma Studio
- Gerencia relacionamentos complexos (User → Interests, Education, Employment, etc.)
- Executa backups e procedimentos de reset quando necessário

## 🔧 Tools & Stack
- [PostgreSQL](https://www.postgresql.org/) como banco principal
- [Prisma ORM](https://www.prisma.io/) para schema e migrações
- [Prisma Studio](https://www.prisma.io/studio) para interface gráfica
- Scripts npm: `db:studio`, `db:reset`, `db:seed`
- Docker para ambientes isolados

## 🔄 Workflow Integration
- Recebe requisições de mudanças no schema do Backend Developer
- Executa migrações após aprovação do Tech Lead
- Fornece acesso ao Prisma Studio para QA Engineer validar dados
- Monitora queries lentas reportadas pelo DevOps Specialist
- Colabora com Backend Developer em otimizações de relacionamentos

## 📜 Rules of Engagement
- Sempre gerar migração antes de alterar schema: `npx prisma migrate dev --name descricao`
- Nunca executar `npx prisma db push --force-reset` em produção
- Validar integridade referencial antes de aplicar mudanças
- Manter documentação atualizada dos relacionamentos entre tabelas
