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
  const passUrl = ['/login', '/register']
  // 公共路径
  if (passUrl.includes(ctx.request.url)) {
    return next()
  }
  // 校验token
  const token = ctx.request.headers['authorization'].split(' ')[1]
  if (token) {
    try {
      var { time, maxAge } = jwt.verify(token, SECRET)
    } catch (error) {
      // 解析token出错
      ctx.body = noPass
    }
    if (time && maxAge && Date.now() - time <= maxAge) {
      // 数据库校验
      if (await Redis.checkToken(token)) {
        // 未过期
        return next()
      }
    }
  }
  ctx.body = noPass
}
