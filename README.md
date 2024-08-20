# Echarts SSR Service

<div align="center">
  
📘English|[中文](./README.zh-CN.md).

</div>

> Inspired by [echarts5-canvas-ssr](https://github.com/mosliu/echarts5-canvas-ssr#readme).

## Changes & Improvements

- Update [echarts](https://echarts.apache.org/) to version `^5.4.*`. Support for some new features.

- Use [skr canvas](https://github.com/Brooooooklyn/canvas) to instead of [node-canvas](https://github.com/Automattic/node-canvas).There is no need to install additional dependencies and the performance is excellent.

- Use `cluster` for efficiency.

- Support for two types of response,including image buffer and SVG string.

- Support parsing functions in echarts option.

## Usage

```sh

docker build -t echarts-ssr-server:latest .

docker run --name echarts-ssr-server-instance -dp 10086:10086 -v echarts-fonts:/usr/share/fonts echarts-ssr-server:latest

```

**Note**: Install the `package.json` dependencies inside the docker.

Body of `POST` Request :

| Parameter | Type               | Description                                                                                                                                                                                   |
| --------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`    | `'png'\|'svg'`     | Type of Response content. if the `type` value is `'png'`, the `Buffer` type data is returned. if the `type` value is `'svg'`, the Base64-encoded svg string is returned. Defaults to `'png'`. |
| `option`  | `EchartCoreOption` | Options to configure Echart.                                                                                                                                                                  |
| `width`   | `number \| string` | Chart width.                                                                                                                                                                                  |
| `height`  | `number \| string` | Chart height.                                                                                                                                                                                 |

If you need to use a function in the echarts option, send it as a string.For example:

```json
{
    "legend": {
        "data": ["Sales", "Marketing", "Technology"],
        "formatter": "(name) => name.toUpperCase()"
    }
}
```

## Custom Deployment

You can customize the `ENV` variables in `Dockfile` to modify the default configurations.

```Dockfile
# Number of worker threads.
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
```
