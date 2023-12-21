const http = require("http");
const echarts = require("./echarts.generator");
const url = require("url");
const cluster = require("cluster");
const safeEval = require("safe-eval");
const json5 = require("json5");

const WORKER_NUM = process.env.WORKER_PROCESSES
  ? parseInt(process.env.WORKER_PROCESSES, 10)
  : 4;

const AUTHORIZATION = process.env.AUTHORIZATION || "Bearer 123";

const HOST = process.env.HOST || "0.0.0.0";

const PORT = process.env.PORT || 7654;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running.`);
  for (let i = 0; i < WORKER_NUM; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died.`);
  });
} else {
  const server = http.createServer(function (request, response) {
    processConfig(request, response, function () {
      let config;
      try {
        config = json5.parse(request.config, (_, value) => {
          if (
            typeof value === "string" &&
            (value.includes("function") || value.includes("=>"))
          ) {
            return safeEval(value);
          }
          return value;
        });
      } catch (e) {
        response.statusCode = 400;
        response.end('request parameter "config" format invalid, is not JSON.');
        return;
      }
      if (!config || !config.option) {
        response.statusCode = 400;
        response.end('request parameter "config" format invalid.');
        return;
      }
      const result = echarts({
        type: config.type,
        option: config.option,
        width: config.width || 600,
        height: config.height || 400,
      });
      if (!config.type || (config.type && config.type === "png")) {
        response.setHeader("Content-Type", "image/png");
      }
      response.write(result);
      response.end();
    });
  });
  server.listen(parseInt(PORT, 10), HOST, function () {
    console.log(`Worker ${process.pid} started server at port ${PORT}.`);
  });
}

function processConfig(request, response, callback) {
  let queryData = "";
  if (typeof callback !== "function") {
    return null;
  }
  const auth = request.headers["authorization"];
  if (!auth || auth !== AUTHORIZATION) {
    response.statusCode = 401;
    response.end("No authorization.");
    return;
  }
  if (request.method === "GET") {
    const arg = url.parse(request.url, true).query;
    if (!arg.config) {
      response.statusCode = 400;
      response.end('request parameter "config" invalid.');
      return;
    }
    request.config = arg.config;
    callback();
  } else {
    request.on("data", function (data) {
      queryData += data;
      if (queryData.length > 1e6) {
        response.statusCode = 422;
        response.end("request body too large.");
      }
    });
    request.on("end", function () {
      request.config = queryData;
      callback();
    });
  }
}
