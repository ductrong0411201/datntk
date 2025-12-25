FROM node:20
WORKDIR /app
RUN apt-get update && apt-get install -y nano && rm -rf /var/lib/apt/lists/*
COPY package.json .
COPY . .
RUN npm install

CMD npm run dev
