FROM node:10
WORKDIR /app
COPY package*.json /app/
RUN npm install
RUN npm install @vue/cli@3.7.0 -g
RUN npm install --save bootstrap-vue
RUN npm install --save vue-numeric
COPY . /app/
EXPOSE 4000
CMD ["npm", "run", "serve"]