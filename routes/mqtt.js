// 导入tcp发送数据特权方法
const { sendDataByTCP } = require('../server/tcpServer')
// 导入websocket发送数据特权方法
const { sendDataByWebSocket } = require('../server/webSocketServer')

/* 配置文件 */
const myConfig = require('../config/mqttConfig.js')

// 操作防抖标志
let isDebounce = false

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
      ProductId: myConfig.MY_PRODUCTID,
      DeviceName: myConfig.MY_DEVICENAME,
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
      ProductId: myConfig.MY_PRODUCTID,
      DeviceName: myConfig.MY_DEVICENAME,
      Offset: 0,
      Limit: 10,
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
      InputParams: '{"speed_whole":0,"move_angle":0}',
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
    ProductId: myConfig.MY_PRODUCTID,
    DeviceName: myConfig.MY_DEVICENAME,
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
        "cur_duoji_1_angle": 0,
        "cur_duoji_2_angle": 0,
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

// 配置mqtt路由
module.exports = (router) => {
  // 腾讯sdk数据状态接口，通过websocket推送到客户端
  router.post('/receive', async (ctx, next) => {
    const body = ctx.request.body
    if (body.payload && body.payload.params) {
      // 同步数据回传给客户端
      sendDataByWebSocket(
        JSON.stringify({
          type: 'states',
          data: body,
        })
      )
    }
  })

  // 小车移动控制
  router.post('/move', async (ctx, next) => {
    const body = ctx.request.body
    // 指令防抖
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
    ctx.body = {
      state: 0,
      message: '操作成功',
    }
  })

  // 获取设备所有属性
  router.get('/props/:DeviceName', async (ctx, next) => {
    try {
      var res = await getProps({ DeviceName: ctx.params.DeviceName })
    } catch (error) {}
    ctx.body = res
  })

  // 获取设备单一属性的历史值，用于展示历史数据
  router.post('/historyPropValue', async (ctx, next) => {
    const body = ctx.request.body
    try {
      var res = await getHistoryPropValue({
        DeviceName: body.DeviceName,
        FieldName: body.FieldName,
        Limit: body.Limit * 1,
      })
    } catch (error) {}
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
}
