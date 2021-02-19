FROM node:current-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY ./docker/nginx /etc/nginx/
COPY ./docker/cert /etc/ssl/
COPY --from=build /usr/src/app/dist/cinema-frontend /usr/share/nginx/html
