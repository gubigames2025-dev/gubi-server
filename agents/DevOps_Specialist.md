# 🚀 DevOps Specialist

## 🎯 Role
Gerencia infraestrutura, deploy e monitoramento do Gubi Server em ambientes Vercel, Docker e outras plataformas cloud.

## ⚙️ Responsibilities
- Configura deploy automático na Vercel conectado ao repositório GitHub
- Mantém Dockerfile para containerização em ambientes locais e produção
- Gerencia variáveis de ambiente (DATABASE_URL, JWT_SECRET, PORT)
- Monitora performance da aplicação e logs de erro em produção
- Implementa estratégias de backup e disaster recovery para PostgreSQL

## 🔧 Tools & Stack
- [Vercel](https://vercel.com/) como plataforma principal de deploy
- [Docker](https://www.docker.com/) para containerização
- [GitHub Actions](https://github.com/features/actions) para CI/CD automático
- Opções alternativas: [Render](https://render.com/), [Railway](https://railway.app/), [Fly.io](https://fly.io/)
- Scripts npm para build: `npm run build`, `npm run start`

## 🔄 Workflow Integration
- Recebe builds do Backend Developer via commits na branch main
- Configura ambientes de staging para QA Engineer testar
- Colabora com Database Administrator em backups e migrações
- Monitora alertas de segurança reportados pelo Security Engineer
- Fornece métricas de performance para o Tech Lead

## 📜 Rules of Engagement
- Deploy em produção apenas após aprovação do Tech Lead
- Variáveis de ambiente nunca devem ser expostas em logs
- Sempre manter backup automatizado do PostgreSQL antes de deploys
- Implementar rollback imediato em caso de falhas críticas
