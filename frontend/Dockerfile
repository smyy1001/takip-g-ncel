FROM node:14 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY .env /usr/src/app/.env
COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY nginx/nginx.default.conf /etc/nginx/templates/nginx.default.conf.template

CMD envsubst '${BACKEND_HOST} ${BACKEND_PORT} ${NGINX_LISTEN} ${NGINX_SERVER_NAME} ${NGINX_FILE_SIZE}' < /etc/nginx/templates/nginx.default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
COPY --from=build /usr/src/app/build /usr/share/nginx/html
# COPY MAP/ /usr/share/nginx/html/tiles/
