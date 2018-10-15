const path = require("path");

module.exports = {
    build: {
        env: "production",
        index: path.resolve(__dirname, "../dist/index.html"),
        assetsRoot: path.resolve(__dirname, "../dist"),
        assetsSubDirectory: "static",
        assetsPublicPath: "/",
        productionSourceMap: true,
        productionGzip: false,
        productionGzipExtensions: ["js", "css"]
    },
    dev: {
        env: "development",
        port: 3001,
        assetsSubDirectory: "static",
        assetsPublicPath: "/",
        context: ["/user","/posts","/file","/avatar","/editor","/logo","/admin"],
        proxypath: "http://localhost:8000"
    }
};
 