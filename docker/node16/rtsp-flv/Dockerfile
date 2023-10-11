FROM node:16

ENV RHF_HOST '0.0.0.0'
ENV RHF_PORT 8080

COPY index.js package.json ./
COPY ./views/index.html ./views/index.html
RUN npm install

CMD ["node", "index.js"]