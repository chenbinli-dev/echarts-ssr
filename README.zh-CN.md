# Echarts SSR Service

<div align="center">
  
📘[English](./README.md)|中文.

</div>

> 该项目受[echarts5-canvas-ssr](https://github.com/mosliu/echarts5-canvas-ssr#readme)启发

## 变更 & 改进

- 更新 [echarts](https://echarts.apache.org/) 到 `^5.4.*`版本。支持一些新特性。

- 使用 [skr canvas](https://github.com/Brooooooklyn/canvas) 替代 [node-canvas](https://github.com/Automattic/node-canvas)。这个库不需要安装额外的依赖并且性能更好。

- 使用 `cluster` 提升效率。

- 支持两种类型的响应，包括图片 buffer 和 SVG 字符串。

- 支持在 Echats 配置项中解析函数。

## 使用方法

```sh

docker build -t echarts-ssr-server:latest .

docker run --name echarts-ssr-server-instance -dp 10086:10086 -v echarts-fonts:/usr/share/fonts echarts-ssr-server:latest

```

**注意**: 在 docker 中安装 `package.json` 中的依赖.

`POST`请求体 :

| 参数     | 类型               | 描述                                                                                                                                           |
| -------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`   | `'png'\|'svg'`     | 响应内容的类型. 如果 `type` 值为 `'png'`, 则返回 `Buffer` 类型数据. 如果 `type` 值为 `'svg'`, 则返回 Base64 编码的 SVG 字符串. 默认为 `'png'`. |
| `option` | `EchartCoreOption` | Echarts 的配置项                                                                                                                               |
| `width`  | `number \| string` | 图图表宽度                                                                                                                                     |
| `height` | `number \| string` | 图表高度                                                                                                                                       |

如果你需要在 echarts 选项中使用函数，请将它以字符串的形式发送。例如:

```json

{
  "legend": {
    "data": ["Sales", "Marketing", "Technology"],
    "formatter": "(name) => name.toUpperCase()"
  }
}

```

## 自定义部署

你可以在`Dockfile`中自定义`ENV`变量来修改默认配置。

```Dockfile
# worker thread的数量
# 确保你不会超过你机器的CPU总核数
# 最佳实践是使用一半的CPU核数
ENV WORKER_PROCESSES=8

# 服务的简单验证
ENV AUTHORIZATION="Bearer 123"

# Node服务的hostname。默认为"0.0.0.0"
ENV HOST="0.0.0.0"

# Node服务的端口，请确保这个端口是可用的。默认为7654
ENV PORT=10086

# 这个值决定了图表的分辨率，在浏览器中默认为window.devicePixelRatio
ENV DEVICE_PIXEL_RATIO=1.5
```
