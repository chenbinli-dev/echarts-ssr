# Echarts SSR

Inspired by [echarts5-canvas-ssr](https://github.com/mosliu/echarts5-canvas-ssr#readme)

## Changes

- Update [echarts](https://echarts.apache.org/) to version `^5.4.*`. Support for some new features.

- Use [skr canvas](https://github.com/Brooooooklyn/canvas) to instead of [node-canvas](https://github.com/Automattic/node-canvas).

- Use `cluster` for efficiency.

- Support for two types of response,including image buffer and SVG string.

- Support parsing Using functions in echarts option.

## Uasge

```sh

docker build -t echarts-ssr-server:latest .

docker run --name echarts-ssr-server-instance -dp 10086:10086 -v echarts-fonts:/usr/share/fonts echarts-ssr-server:latest

```

**Note:**Install the package.json dependency inside docker.


Body of `POST` Request :

Parameter | Type | Description
----- | ----- | -----
`type` | `'png'\|'svg'` | Response content type, if `type` is `'png'`, return `Buffer`.if `type` is `'svg'`, return a Base64-encoded svg string.
`option`| `EchartCoreOption`| Options of echarts
`width`| `number \| string` | Width of the chart
`height`| `number \| string` | Height of the chart

