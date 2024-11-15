# Usa a imagem oficial do Node.js como base
FROM node:16

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código restante da aplicação
COPY . .

# Exponha a porta que a API usa
EXPOSE 3750

# Comando para iniciar a aplicação
CMD ["npm", "start"]
