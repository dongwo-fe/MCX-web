const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy_dev = require('../.dev.proxy.json');
const fs = require('fs');
const path = require('path');

const local_path = path.join(__dirname, '../.local.json');
const isat = fs.existsSync(local_path);

module.exports = function (app) {
    if (proxy_dev.proxy) {
        for (let index = 0; index < proxy_dev.proxy.length; index++) {
            const data = proxy_dev.proxy[index];
            app.use(
                data.url,
                createProxyMiddleware({
                    target: data.target,
                    changeOrigin: true,
                    pathRewrite: data.pathRewrite,
                    secure: false,
                })
            );
        }
    }
};
