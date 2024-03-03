/* eslint-disable global-require */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    app.use(corsMiddlewares);
    const addProdMiddlewares = require('./addProdMiddlewares');
    addProdMiddlewares(app, options);
  } else {
    app.use('/api',
      createProxyMiddleware({
        target: 'http://127.0.0.1:4066',
        secure: false,
      }));
    app.use('/socket',
      createProxyMiddleware({
        target: 'http://localhost:4066/',
        secure: false,
        ws: true,
      }));
    const webpackConfig = require('../../webpack/webpack.dev.babel');
    const addDevMiddlewares = require('./addDevMiddlewares');
    addDevMiddlewares(app, webpackConfig);
  }

  return app;
};

function corsMiddlewares(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://tcameradev.thinklabs.com.vn');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return next();
}
