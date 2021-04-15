const path = require('path')
/* HTTP Server */
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const staticFiles = require('koa-static')

// 404 中间键
const notFind = require('../middleware/404')
// token 校验中间键
const auth = require('../middleware/auth')

// 导入路由
const router = require('../routes/router')

// 导入配置
const { httpConfig } = require('../config/serverConfig.js')

process.env.domain =
  process.env.NODE_ENV == 'production' ? 'wlw.5102it.cn' : httpConfig.host

app
.use(cors())
  .use(
    koaBody({
      multipart: true,
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
      },
    })
  )
  .use(bodyParser())
  .use(staticFiles(path.resolve(__dirname, '../iotc/')))
  .use(auth)
  .use(router.routes())
  .use(router.allowedMethods())
  .use(notFind)
  .listen(httpConfig.port, () => {
    console.log(
      `HTTP server is listening in ${process.env.domain}:${httpConfig.port}`
    )
  })

module.exports = {
  app,
}
