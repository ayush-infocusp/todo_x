#stage1
FROM node:alpine AS build
WORKDIR /app
COPY package.json .
#stage2
RUN npm install -g @angular/cli
RUN npm install --f
COPY . .
RUN npm run build
#stage3
FROM nginx:alpine
COPY  --from=build /app/dist/todo_app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# #stage 1
# FROM node:alpine as node
# RUN mkdir /app
# WORKDIR /app
# COPY . .
# #stage 2
# RUN npm install -g @angular/cli
# RUN npm install --f
# # RUN npm run build

# #stage3
# # FROM nginx:alpine
# # COPY --from=node /app/dist/angular-app /usr/share/nginx/html
# #CMD ["ng","serve","--host","0.0.0.0","--port","4200"]
# CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]