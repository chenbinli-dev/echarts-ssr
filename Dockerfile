FROM node:18

RUN yarn config set registry https://registry.npmmirror.com

RUN yarn global add pm2 && yarn cache clean

WORKDIR /app/

COPY package.json /app/
COPY yarn.lock /app/

RUN yarn install

COPY . /app/

COPY fonts :/user/share

EXPOSE 10086

# The worker thread number.
# Make sure you do not exceed the total number of CPU cores in your machine.
# The best practice is half the total number of cpu cores.
ENV WORKER_PROCESSES=8

# Simple verification for the server.
ENV AUTHORIZATION="Bearer 123"

# The hostname of node server. Defaults to "0.0.0.0".
ENV HOST="0.0.0.0"

# The port of node server.Make sure the ports are consistent.Defaults to 7654.
ENV PORT=10086

# This value determines the resolution of the chart and defaults to window.devicePixelRatio in browsers.
ENV DEVICE_PIXEL_RATIO=1.5

CMD [ "pm2-runtime","main.js" ]