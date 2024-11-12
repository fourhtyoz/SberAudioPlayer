# FROM node:18

# WORKDIR /frontend

# COPY . /frontend

# RUN npm install

# EXPOSE 3000

# CMD ["npm", "start"]

FROM node:18 AS build

WORKDIR /app
COPY . /app

RUN npm install && npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
