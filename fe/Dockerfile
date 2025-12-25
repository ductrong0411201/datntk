FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y nano && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
