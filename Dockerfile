FROM node:16.14
WORKDIR /usr/src/api
COPY package*.json ./
RUN npm install --production
COPY . .
ENV HOST 0.0.0.0
ENV PORT 3003
ENV ADMIN_FIRSTNAME admin
ENV ADMIN_LASTNAME admin
ENV ADMIN_PWD admin
ENV ADMIN_MAIL touroncamille@icloud.com
ENV SECRET 10
ENV FORCE false
ENV TOKEN_TIMEOUT 2h
EXPOSE $PORT
CMD [ "npm", "start" ]