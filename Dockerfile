FROM node:16-buster-slim as build-step
RUN apt-get update --fix-missing && apt-get install -y ffmpeg graphicsmagick libreoffice libsm6 libxi6 libxext6 imagemagick
WORKDIR /usr/src/app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

FROM nginx:1.18.0-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
