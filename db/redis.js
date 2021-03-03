const Redis = require('ioredis')
// 导入配置
const { redisConfig } = require('../config/dbConfig.js')

// 导入配置
const config = require('../config/config.js')

const redisClient = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
})

// redis准备
redisClient.on('ready', function (error) {
  console.log('redis 已准备好')
})

// redis连接
redisClient.on('connect', function (error) {
  console.log('[主进程]【redis】 已连接 监听 127.0.0.1:6379')
  if (redisConfig.INIT_CLEAR) {
    // redisClient.flushdb(() => {
    //   console.log('初始化清空redis')
    // })
  }
})

// redis重新连接
redisClient.on('reconnecting', function (error) {
  console.log('redis 已重新连接')
})

// redis关闭
redisClient.on('end', function (error) {
  console.log('redis 已关闭')
})

// redis警告
redisClient.on('warning', function (error) {
  console.log('redis 发出警告')
})

// redis出错
redisClient.on('error', function (error) {
  console.error(error)
  redisClient.quit(() => {
    console.log('redis 已退出')
  })
})

// 修改同步字段
async function modifySyncData(user, device, fields) {
  if (!(fields instanceof Array)) return false
  // 用户名下存在设备 user:{name}:{number}
  if (await redisClient.hget(user, `device:${device}`)) {
    await redisClient.hset(`user:${user}:${device}`, 'syncData', fields.join())
    return true
  }
  return false
}

// 修改wifi2波特率
async function modifyBaudRate(user, device, baudRate) {
  // 用户名下存在设备 user:{name}:{number}
  if (await redisClient.hget(user, `device:${device}`)) {
    await redisClient.hset(`user:${user}:${device}`, 'baudRate', baudRate)
    return true
  }
  return false
}

// 修改默认配置
async function modifyDefaultConfig(user, device, config) {
  // 用户名下存在设备 user:{name}:{number}
  if (await redisClient.hget(user, `device:${device}`)) {
    await redisClient.hset(`user:${user}:${device}`, 'defaultConfig', JSON.stringify(config))
    return true
  }
  return false
}

// 获取默认配置
async function getDefaultConfig(user, device) {
  // 用户名下存在设备 user:{name}:{number}
  if (await redisClient.hget(user, `device:${device}`)) {
    return await redisClient.hget(`user:${user}:${device}`, 'defaultConfig')
  }
  return false
}

// 获取需同步的数据
async function getSyncData(user, device) {
  // 用户名下存在设备 user:{name}:{number}
  if (await redisClient.hget(user, `device:${device}`)) {
    return await redisClient.hget(`user:${user}:${device}`, 'syncData')
  }
  return false
}

// 小车连接控制
async function changeRunningState(user, device, operate,state) {
  // 用户名下存在设备 user:{name}:{number}
  if (await redisClient.hget(user, `device:${device}`)) {
    await redisClient.hset(`user:${user}:${device}`, operate,state)
    return true
  }
  return false
}

// 校验用户存在
async function checkHasUser(user) {
  return await redisClient.hexists(user, 'exists')
}

// 登录密码校验
async function checkUserPass(user, password) {
  return (await redisClient.hget(user, 'password')) === password
}

// 注册账号
async function registerAccount(user, password) {
  // 注册账号
  if (!(await redisClient.hset(user, 'password', password))) {
    return false
  }
  // 标记为存在
  if (!(await redisClient.hset(user, 'exists', 'true'))) {
    return false
  }
  return true
}

// token 有效性校验
async function checkToken(token, user) {
  // 存在user名称,校验token是否为指定用户所有
  if (user) {
    return (await redisClient.get(token)) === user
  } else {
    // 在线校验 token 存在
    return await redisClient.get(token)
  }
}

// token 记录生成,只在登录或者重新激活还未过期时重新设置token
async function createToken(token, user) {
  // 设置账号一小时过期
  return redisClient.setex(token, config.COOKIE_MAXAGE, user)
}

module.exports = {
  redisClient,
  modifySyncData,
  checkHasUser,
  checkUserPass,
  registerAccount,
  checkToken,
  createToken,
  modifyBaudRate,
  modifyDefaultConfig,
  changeRunningState,
  getDefaultConfig,
  getSyncData
}
