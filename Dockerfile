FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de configuração primeiro (melhor cache)
COPY package*.json tsconfig.json ./

# Instala as dependências
RUN npm install

# Copia as definições do Prisma (se usar)
COPY prisma ./prisma
RUN npx prisma generate

# Copia o código fonte (ESSENCIAL!)
COPY src ./src

# Compila o projeto
RUN npm run build

# Verifica se o build realmente gerou o arquivo principal
RUN test -f dist/index.js

# Expõe a porta da API
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "run", "start"]
