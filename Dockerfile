FROM node:24-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]

# docker build -t kiran .
# docker run -d -p 3000:3000 --name kiran-app kiran
