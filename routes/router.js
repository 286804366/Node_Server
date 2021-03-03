/* 路由 */

const fs = require('fs')

const router = require('koa-router')()

// 导入tcp发送数据特权方法
const { tcpServer, sendDataByTCP } = require('../server/tcpServer')
// 导入websocket发送数据特权方法
const { sendDataByWebSocket } = require('../server/webSocketServer')
// redis数据库
const Redis = require('../db/redis')
// token
const jwt = require('jsonwebtoken')
// 盐
const config = require('../config/config')

// 操作防抖标志
let isDebounce = false

/* 配置文件 */
const myConfig = require('../config/mqttConfig.js')

/* 腾讯sdk */
const tencentcloud = require('tencentcloud-sdk-nodejs')
const IotexplorerClient = tencentcloud.iotexplorer.v20190423.Client
const clientConfig = {
  credential: {
    secretId: myConfig.MY_SECRETID,
    secretKey: myConfig.MY_SECRETKEY,
  },
  region: myConfig.MY_REGION,
  profile: {
    httpProfile: {
      endpoint: 'iotexplorer.tencentcloudapi.com',
    },
  },
}
// 创建mqtt客户端
const tencentClient = new IotexplorerClient(clientConfig)

/* mqtt API */
// 获取属性数据
function getProps(params) {
  params = Object.assign({}, myConfig.params, params)
  return tencentClient.DescribeDeviceData(params)
}

// 获取历史属性值
function getHistoryPropValue(params) {
  params = Object.assign(
    {
      MinTime: Date.now() - 1000 * 60,
      MaxTime: Date.now(),
      Limit: 30,
      FieldName: 'cur_speed_whole',
    },
    myConfig.params,
    params
  )
  return tencentClient.DescribeDeviceDataHistory(params)
}

// 查看设备详情
function getDeviceDes(params) {
  params = Object.assign(
    {
      ProductId: 'K8LG8U17CW',
      DeviceName: 'test2',
    },
    myConfig.params,
    params
  )
  return tencentClient.DescribeDevice(params)
}

// 获取设备列表
function getDeviceList(params) {
  params = Object.assign(
    {
      ProductId: 'K8LG8U17CW',
      Offset: 0,
      Limit: 10,
      DeviceName: 'test2',
    },
    myConfig.params,
    params
  )
  return tencentClient.GetDeviceList(params)
}

// 调用行为
function dispatchAction(params, isAsync = true) {
  params = Object.assign(
    {
      ActionId: 'set_move_speed_and_angle',
      InputParams: '{"speed_whole":52.2,"move_angle":22.1}',
    },
    myConfig.params,
    params
  )
  return isAsync
    ? tencentClient.CallDeviceActionAsync(params)
    : tencentClient.CallDeviceActionSync(params)
}

// 创建、删除设备
function putDevice(params, isCreate = true) {
  params = {
    ProductId: 'K8LG8U17CW',
    DeviceName: 'test2',
  }
  return isCreate
    ? tencentClient.CreateDevice(params)
    : tencentClient.DeleteDevice(params)
}

// 设备透传指令，修改属性值
function putProps(params) {
  params = Object.assign(
    {
      Topic: `$thing/down/property/${
        params.ProductId || myConfig.MY_PRODUCTID
      }/${params.DeviceName || myConfig.MY_DEVICENAME}`,
      Qos: 1,
      Payload: `{
        "clientToken": "clientToken-25dc324b-140b-4075-a715-563e7a7f8568",
        "method": "control",
        "params": {
        "cur_duoji_1_angle": 30,
        "cur_duoji_2_angle": 20,
        }
      }`,
    },
    myConfig.params,
    params
  )
  return tencentClient.PublishMessage(params)
}

// 小车移动指令，通过透传到wifi2
function putMove(command) {
  return sendDataByTCP(command)
}

// 腾讯sdk数据状态接口，通过websocket推送到客户端
router.post('/receive', async (ctx, next) => {
  const body = ctx.request.body
  if (body.payload && body.payload.params) {
    // console.log(body)
    // 同步数据回传给客户端
    sendDataByWebSocket(
      JSON.stringify({
        type: 'states',
        data: body,
      })
    )
  }
})

// 小车移动
router.post('/move', async (ctx, next) => {
  const body = ctx.request.body

  if (isDebounce) return (ctx.body = 'debounce')
  // 防抖
  if (body.debounce) {
    isDebounce = true
    setTimeout(() => {
      isDebounce = false
    }, body.time)
  }
  console.log(`@${JSON.stringify(body.data)}$`)
  putMove(`@@@@@@${JSON.stringify(body.data)}$`)
  ctx.body = 'ok'
})

// 获取设备所有属性
router.get('/props/:DeviceName', async (ctx, next) => {
  try {
    var res = await getProps({ DeviceName: ctx.params.DeviceName })
  } catch (error) {}
  //log(res)
  ctx.body = res
})

// 获取设备单一属性的历史值
router.post('/historyPropValue', async (ctx, next) => {
  const body = ctx.request.body
  try {
    var res = await getHistoryPropValue({
      DeviceName: body.DeviceName,
      FieldName: body.FieldName,
      Limit: body.Limit * 1,
    })
  } catch (error) {}
  //log(res)
  ctx.body = res
})

// 获取设备详情
router.get('/deviceDes/:DeviceName', async (ctx, next) => {
  try {
    var res = await getDeviceDes({ DeviceName: ctx.params.DeviceName })
  } catch (error) {}
  //log(res)
  ctx.body = res
})

// 获取设备列表
router.get('/deviceList', async (ctx, next) => {
  try {
    var res = await getDeviceList({
      Offset: ctx.query.Offset,
      Limit: ctx.query.Limit,
    })
  } catch (error) {}
  //log(res)
  ctx.body = res
})

// 调用行为
router.post('/dispatchAction', async (ctx, next) => {
  const body = ctx.request.body
  try {
    var res = await dispatchAction(
      {
        DeviceName: body.DeviceName,
        ActionId: body.ActionId,
        InputParams: body.InputParams,
      },
      body.isAsync
    )
  } catch (error) {}
  //log(res)
  ctx.body = res
})

// 创建、删除设备
router.put('/putDevice', async (ctx, next) => {
  const body = ctx.request.body
  try {
    var res = await putDevice({ DeviceName: body.DeviceName }, body.isCreate)
  } catch (error) {}
  //log(res)
  ctx.body = res
})

// 修改属性
router.put('/putProps', async (ctx, next) => {
  const body = ctx.request.body
  try {
    var res = await putProps({
      DeviceName: body.DeviceName,
      Qos: body.Qos,
      Topic: body.Topic,
      Payload: body.Payload,
    })
  } catch (error) {}
  //log(res)
  ctx.body = res
})

// 更新小车固件
router.post('/updatefirmware', async (ctx, next) => {
  const files = ctx.request.files
  if (files.file.path) {
    fs.readFile(files.file.path, (err, chunk) => {
      sendDataByTCP(chunk)
    })
  }
  ctx.body = 'ok'
})

// 配置小车默认数据
router.post('/modifyDefaultConfig', async (ctx, next) => {
  const body = ctx.request.body
  if (body.user && body.device) {
    if (await Redis.modifyDefaultConfig(body.user, body.device, body.config)) {
      return (ctx.body = {
        state: 0,
        message: '保存成功',
      })
    }
  }
  ctx.body = {
    state: 1,
    message: '保存失败',
  }
})

// 小车连接控制
router.post('/controlRunning/:operate', async (ctx, next) => {
  const body = ctx.request.body
  const operate = ctx.request.params.operate
  if (body.user && body.device) {
    if (
      (await Redis.changeRunningState(body.user, body.device, operate),
      body.state)
    ) {
      return (ctx.body = {
        state: 0,
        message: '操作成功',
      })
    }
  }
  ctx.body = {
    state: 1,
    message: '操作失败',
  }
})

// 配置小车字段
router.post('/modifyData/:field', async (ctx, next) => {
  const body = ctx.request.body
  const field = ctx.request.params.field
  if (body.user && body.device) {
    if (
      field === 'syncData' &&
      (await Redis.modifySyncData(body.user, body.device, body.fields))
    ) {
      return (ctx.body = {
        state: 0,
        message: '保存成功',
      })
    }
    if (
      field === 'baudRate' &&
      (await Redis.modifyBaudRate(body.user, body.device, body.baudRate))
    ) {
      return (ctx.body = {
        state: 0,
        message: '保存成功',
      })
    }
  }
  ctx.body = {
    state: 1,
    message: '保存失败',
  }
})

// 获取默认配置
router.post('/syncData', async (ctx, next) => {
  const body = ctx.request.body
  if (body.user && body.device) {
    const res = await Redis.getSyncData(body.user, body.device)
    if (res) {
      return (ctx.body = {
        state: 0,
        message: '获取成功',
        data:res
      })
    }
  }
  ctx.body = {
    state: 1,
    message: '获取失败',
  }
})

// 获取需同步的数据
router.post('/defaultConfig', async (ctx, next) => {
  const body = ctx.request.body
  if (body.user && body.device) {
    const res = await Redis.getDefaultConfig(body.user, body.device)
    if (res) {
      return (ctx.body = {
        state: 0,
        message: '获取成功',
        data:res
      })
    }
  }
  ctx.body = {
    state: 1,
    message: '获取失败',
  }
})

// 注册账号
router.post('/register', async (ctx, next) => {
  const body = ctx.request.body
  // 校验用户存在
  if (await Redis.checkHasUser(body.user)) {
    return (ctx.body = {
      state: 1,
      message: '用户已存在',
    })
  }

  // 注册账号
  if (!(await Redis.registerAccount(body.user, body.password))) {
    return (ctx.body = {
      state: 1,
      message: '注册失败',
    })
  }

  ctx.body = {
    state: 0,
    message: '注册成功',
  }
})

// 登录校验
router.post('/login', async (ctx, next) => {
  const body = ctx.request.body
  // 校验用户存在
  if (!(await Redis.checkHasUser(body.user))) {
    return (ctx.body = {
      state: 1,
      message: '用户不存在',
    })
  }

  // 校验密码有效性
  if (!(await Redis.checkUserPass(body.user, body.password))) {
    return (ctx.body = {
      state: 1,
      message: '密码错误',
    })
  }
  // 生成token
  const token = jwt.sign(
    {
      user: body.user,
      password: body.password,
      time: Date.now(),
      maxAge: config.COOKIE_MAXAGE * 1000,
    },
    config.SECRET
  )
  // 生成并记录token
  if (!(await Redis.createToken(token, body.user))) {
    return (ctx.body = {
      state: 1,
      message: '登录失败',
    })
  }

  ctx.body = {
    state: 0,
    message: '登录成功',
    token: token,
  }
})
module.exports = router
