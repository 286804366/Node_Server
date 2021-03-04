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

/* 数据库 curd */
// 校验设备是否存在用户名下,存在则获取设备密钥
async function checkDevice(user, secret) {
  let deviceList = await redisClient.hget(user, 'deviceList')
  if (deviceList) {
    deviceList = JSON.parse(deviceList) || []
    for (const car of deviceList) {
      if (car.secret === secret) {
        return car.secret
      }
    }
  }
  return false
}

// 校验设备是否已注册过
async function checkDeviceRegister(secret) {
    return await redisClient.hexists(`device:${secret}`, 'exists')
}

// 修改设备
async function changeDevice(user, secret, type, name) {
  // 设备未登记过，无法绑定
  if(!await checkDeviceRegister(secret)) return false

  let deviceList = await redisClient.hget(user, 'deviceList')
  let flag
  if (deviceList) {
    deviceList = JSON.parse(deviceList) || []
    for (let i = 0; i < deviceList.length; i++) {
      if (type === 'delete' && deviceList[i].secret === secret) {
        deviceList.splice(i, 1)
        flag = 1
        break
      } else if (type === 'edit') {
        if (deviceList[i].name === name || deviceList[i].secret === secret) {
          deviceList[i].name = name
          deviceList[i].secret = secret || deviceList[i].secret
          flag = 1
          break
        }
      }
    }
    // 未处理，则新增
    if (!flag) {
      deviceList.push({
        name: name,
        secret: secret,
      })
    }
    await redisClient.hset(user, `deviceList`, JSON.stringify(deviceList))
    return await redisClient.hget(user, `deviceList`)
  }
  return false
}

// 通用修改设备属性
async function modify(type, user, secret, field, data) {
  // 用户名设备 device:{secret}
  secret = checkDevice(user, secret)
  if (secret) {
    const fun = redisClient.hset.bind(this, `device:${secret}`, field)
    switch (field) {
      case 'data':
        await fun(data.join())
        break
      case 'baudRate':
        await fun(data)
        break
      case 'default':
        await fun(JSON.stringify(data))
        break
      default:
        return false
    }

    return true
  }
  return false
}

// 通用获取设备属性
async function get(user, device, field) {
  // 用户设备 device:{secret}
  const secret = checkDevice(user, device)
  if (secret) {
    return await redisClient.hget(`device:${secret}`, field)
  }
  return false
}

// 通用获取公共属性
async function public(user, field) {
  // 获取用户属性
  return await redisClient.hget(user, field)
}

// 设备管理
async function manage(user, secret, field, name) {
  switch (field) {
    case 'delete':
    case 'edit':
      return await changeDevice(user, secret, field, name)
    default:
      return false
  }
}


/* 登录注册数据库操作 */
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
  // 标记为存在,并记录创建时间
  if (!(await redisClient.hset(user, 'exists', new Date().toLocaleString()))) {
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
  checkHasUser,
  checkUserPass,
  registerAccount,
  checkToken,
  createToken,
  modify,
  get,
  public,
  manage,
}
