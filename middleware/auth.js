// token
const jwt = require('jsonwebtoken')
// 盐
const { SECRET } = require('../config/config')
// redis数据库
const Redis = require('../db/redis')

module.exports = async (ctx, next) => {
  const noPass = {
    state: -1,
    message: '登录已过期,请重新登录',
  }
  // 不需要token校验的api
  const passUrl = ['/login', '/register', '/receive']
  // 公共路径
  if (passUrl.includes(ctx.request.url)) {
    return next()
  }

  // 校验token
  if (ctx.request.headers['authorization']) {
    var token = ctx.request.headers['authorization'].split(' ')[1]
  }
  if (token) {
    try {
      // 解析token
      var { time, maxAge } = jwt.verify(token, SECRET)
    } catch (error) {
      // 解析token出错
      return (ctx.body = noPass)
    }
    
    // 未过期
    if (time && maxAge && Date.now() - time <= maxAge) {
      // 数据库校验
      if (await Redis.checkToken(token)) {
        return next()
      }
    }
  }
  ctx.body = noPass
}
