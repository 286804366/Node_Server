/* 路由 */
const router = require('koa-router')()

// 配置mqtt服务器相关路由
require('./mqtt')(router)

// 配置客户端相关路由
require('./client')(router)


module.exports = router
