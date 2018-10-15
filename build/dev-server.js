const path = require("path");
const express = require("express");
const webpack = require("webpack");
const config = require("../config");
const proxyMiddleware = require("http-proxy-middleware");
const webpackConfig = require("./webpack.dev.js");
const app = express();

var compiler = webpack(webpackConfig); 

app.use(
    require("webpack-dev-middleware")(compiler, {
        publicPath: "/",
        LOGLEVEL: "error",
        quiet: true
    })
);

app.use(require("webpack-hot-middleware")(compiler));

app.use(
    require("connect-history-api-fallback")({
        index: "/index.html"
    })
);

app.use(proxyMiddleware(config.dev.context, { target: config.dev.proxypath, changeOrigin: true }));


app.use(express.static(path.resolve(__dirname, "../dist"))); //如果你是生产环境编译，那么nginx配置连两个server，监听不同虚拟二级域名分离

app.listen(config.dev.port, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("已连接服务器");
});
