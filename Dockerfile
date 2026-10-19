# Usa uma versão leve do Node.js
FROM node:18-alpine

# Cria a pasta de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as bibliotecas (incluindo o bcrypt, jsonwebtoken, express, etc)
RUN npm install

# Copia todo o resto do seu código para dentro do contêiner
COPY . .

# Expõe a porta que a sua API utiliza
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]