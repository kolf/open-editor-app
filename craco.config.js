const CracoLessPlugin = require('craco-less');
const theme = require('./theme');
const ALI_CONTAINER = 'cb16adeacafeb4b9b988ae5d7e8bf0fc1.cn-beijing.alicontainer.com';

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { ...theme },
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  devServer: {
    proxy: {
      '/api/passport': {
        target: `http://passportservice-vcg-com.${ALI_CONTAINER}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/passport': '' }
      },
      '/api/boss3': {
        target: `http://vcg-boss3-usercenter.${ALI_CONTAINER}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/boss3': '' }
      },
      '/api/editor': {
        target: `http://editservice-vcg-com.${ALI_CONTAINER}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/editor': '' }
      },
      '/api/edge': {
        target: `http://edgeservice-vcg-com.${ALI_CONTAINER}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/edge': '' }
      },
      '/api/outsourcing': {
        target: `http://outsourcingservice-vcg-com.${ALI_CONTAINER}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/outsourcing': '' }
      }
    }
  }
};
