FROM node:20

EXPOSE 3000

RUN npm install npm@latest -g

RUN npm install -g @nestjs/cli

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --include=optional && \
    npm install --os=linux --cpu=arm64 sharp && \
    npm cache clean --force

COPY . .

CMD [ "npm", "run", "start:dev" ]
