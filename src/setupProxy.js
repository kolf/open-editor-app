const { createProxyMiddleware } = require('http-proxy-middleware');
const ALI_CONTAINER = 'cb16adeacafeb4b9b988ae5d7e8bf0fc1.cn-beijing.alicontainer.com';

const proxys = {
  passport: 'passportservice-vcg-com',
  editor: 'editservice-vcg-com', //开发环境
  edge: 'edgeservice-vcg-com',
  outsourcing: 'outsourcingservice-vcg-com'
};

module.exports = function (app) {
  Object.keys(proxys).forEach(key => {
    const target = `http://${proxys[key]}.${ALI_CONTAINER}`;
    app.use(
      `/api/${key}/*`,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: (path, req) => path.replace(`/api/${key}`, '')
      })
    );
  });
};
