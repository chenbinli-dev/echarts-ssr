# Echarts SSR

Inspired by [echarts5-canvas-ssr](https://github.com/mosliu/echarts5-canvas-ssr#readme)

## Changes

- Update [echarts](https://echarts.apache.org/) to version `^5.4.*`. Support for some new features.

- Use [skr canvas](https://github.com/Brooooooklyn/canvas) to instead of [node-canvas](https://github.com/Automattic/node-canvas).There is no need to install additional dependencies and the performance is excellent.

- Use `cluster` for efficiency.

- Support for two types of response,including image buffer and SVG string.

- Support parsing Using functions in echarts option.

## Uasge

```sh

docker build -t echarts-ssr-server:latest .

docker run --name echarts-ssr-server-instance -dp 10086:10086 -v echarts-fonts:/usr/share/fonts echarts-ssr-server:latest

```

**Note**: Install the package.json dependency inside docker.


Body of `POST` Request :

Parameter | Type | Description
----- | ----- | -----
`type` | `'png'\|'svg'` | Response content type, if `type` is `'png'`, return `Buffer`.if `type` is `'svg'`, return a Base64-encoded svg string.Defaults to `'png'`.
`option`| `EchartCoreOption`| Options of echarts
`width`| `number \| string` | Width of the chart
`height`| `number \| string` | Height of the chart

## Custom Deployment

 You can customize the `ENV` variables in `Dockfile` to change default configurations.

``` Dockfile
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
```
