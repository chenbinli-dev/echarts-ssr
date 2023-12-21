const echarts = require("echarts");
const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

const DEVICE_PIXEL_RATIO = process.env.DEVICE_PIXEL_RATIO || 1;
/**
 * Register all fonts
 * @param {string} folderPath
 */
function registerFontsFromFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.log("Error reading folder :", folderPath);
      return;
    }
    files.forEach((file) => {
      const fontPath = path.join(folderPath, file);

      fs.stat(fontPath, (err, stats) => {
        if (err) {
          console.log("Error getting file stats :", err);
          return;
        }
        if (stats.isDirectory()) {
          // If it's a directory, recursively register fonts from the subdirectory
          registerFontsFromFolder(fontPath);
        } else {
          // If it's a file, register the font
          GlobalFonts.registerFromPath(
            fontPath,
            path.basename(fontPath).split(".")[0]
          );
        }
      });
    });
    console.log("All fonts registered successfully!");
  });
}

const DEFAULT_OPTIONS = {
  title: {
    text: "test",
  },
  tooltip: {},
  legend: {
    data: ["test"],
  },
  xAxis: {
    data: ["a", "b", "c", "d", "f", "g"],
  },
  yAxis: {},
  series: [
    {
      name: "test",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
};

const DEFAULT_CONFIG = {
  option: DEFAULT_OPTIONS,
  enableAutoDispose: true,
};
/**
 *
 * @param {Object} config
 * @param {?string} config.type - `png` | `svg` . Default is `png`
 * @param {?EchartsCoreOption} config.option - option of echarts
 * @param {?string | number} config.width - width of the chart
 * @param {?string | number} config.height - height of the chart
 * @returns {Buffer | string}
 * - if `config.type` is `png`, return Buffer.
 * - if `config.type` is `svg`, return a Base64-encoded svg string.
 */
module.exports = function (config) {
  const newConfig = Object.assign({}, DEFAULT_CONFIG, config);
  const { type, width, height, option, enableAutoDispose } = newConfig;
  // SVG renderer
  if (type && type === "svg") {
    const chart = echarts.init(null, null, {
      renderer: "svg",
      ssr: true,
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
    chart.setOption(option);
    const svgString = chart.renderToSVGString();

    if (enableAutoDispose) {
      chart.dispose();
    }
    //Encoding to base64
    const buffer = Buffer.from(svgString, "utf-8");
    const base64String = buffer.toString("base64");
    return base64String;
  } else {
    // Canvas renderer
    // Init canvas instance
    const canvas = createCanvas(parseInt(width, 10), parseInt(height, 10));
    // Using canvas instance to initialize echart instance
    const chart = echarts.init(canvas, null, {
      devicePixelRatio: parseInt(DEVICE_PIXEL_RATIO,10),
    });
    // Set options
    option.animation = false;
    option.textStyle = {
      fontFamily: "WenQuanYi Zen Hei",
    };
    chart.setOption(option);

    const buffer = canvas.toBuffer("image/png");
    try {
      if (enableAutoDispose) {
        chart.dispose();
      }
    } catch (e) {
      console.log("Error: failed to dispose chart instace:", e);
    }
    return buffer;
  }
};
