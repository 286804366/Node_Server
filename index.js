/* HTTP Server */

const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const staticFiles = require('koa-static')

process.env.domain =
  process.env.NODE_ENV == 'production' ? 'wlw.5102it.cn' : 'localhost:4444'
/* 配置文件 */
const myConfig = require('./config.js')

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

const client = new IotexplorerClient(clientConfig)

/* webSocket */
const ws = require('ws')

/* TCP Server */
const dgram = require('dgram')
const http = require('http')
const tcp = require('net')
const os = require('os')
const cpus = os.cpus()

const fs = require('fs')
const path = require('path')
const recordLog = require('./log.js')

const cluster = require('cluster')
const cp = require('child_process')

// 进程池
const workers = {}
// 最大创建子进程数
const MAX_CHILD_WORKER_COUNT = 1 || Math.ceil(cpus.length)
// 创建子进程记录周期
const CREATE_WORKER_PERIOD = 1000 * 60
// 单位周期内最多创建的子进程数，超过则退出主进程
const CREATE_WORKER_PER_MAX_COUNT = 30
// 监听ip
const localhost = 'localhost'
// 进程处理TCP顺序队列
const handleTCPQueue = []
// 进程处理WebSocket顺序队列
const handleWebSocketQueue = []

// tcp 连接套接字
let tcpSocket = null
// WebSocket 连接套接字
let webSocket = null
let webSocketReq = null
// 上次剩余buf
let resBuffer = Buffer.from('')
let pictureBuffer = Buffer.from('')
// start buf
let startBuffer = Buffer.from(Uint8Array.of(255, 216))
// end buf
let endBuffer = Buffer.from(Uint8Array.of(255, 217))
// invalid buf
let invalidBuffer = Buffer.from(Uint8Array.of(0, 0))

let beginTime = 0
let historyCount = 0

let isDebounce=false
// cluster.setupMaster({
//   exec: './worker.js',
// })

// // 创建多进程，用于处理 连接
// for (let i = 0; i < MAX_CHILD_WORKER_COUNT; i++) {
//   createWorker()
// }

// 包装log
function log(...res){
  return
  console.log(...res)
}

/* 连接分发 */
// 分发连接
function dispatchConnection(socket, address, type) {
  let handleWorker = ''
  // 当前处理连接队列
  let handleQueue = type === 'TCP' ? handleTCPQueue : handleWebSocketQueue
  // 已有连接
  for (const handleWorker of handleQueue) {
    if (handleWorker[type] === address) {
      workers[handleWorker.id].worker.send(
        { id: handleWorker.id, type },
        socket
      )
      return console.log(
        `[主进程]：新的 ${type} 连接 ${address} 已存在<子进程${handleWorker.id}>中处理 `
      )
    }
  }

  // 存在处理进程
  if (handleQueue.length) {
    handleWorker = handleQueue.shift()
    handleWorker[type] = address
    // 不存在处理当前连接的进程，分发给现有最久未处理的进程
    handleQueue.push(handleWorker)
  } else {
    // 还未有进程处理连接,添加所有进程
    handleQueue.push(
      ...Object.values(workers).map((worker) => ({
        id: worker.id,
        [type]: '',
      }))
    )
    handleWorker = handleQueue[handleQueue.length - 1]
    handleWorker[type] = address
  }
  workers[handleWorker.id].worker.send({ id: handleWorker.id, type }, socket)
  console.log(
    `[主进程]：新的 ${type} 连接 ${address} 分发给<子进程${handleWorker.id}>处理 `
  )
}

// 返回处理队列中进程位置
function getHandleWorkerPos(id, type) {
  const handleQueue = type === 'TCP' ? handleTCPQueue : handleWebSocketQueue
  return handleQueue.findIndex((worker) => worker.id == id)
}

// 创建子进程
function createWorker() {
  // 记录已创建过的子进程数
  if (historyCount < CREATE_WORKER_PER_MAX_COUNT) {
    // 未开始计时
    if (beginTime === 0) {
      beginTime = Date.now()
    }
    historyCount++
  } else {
    // 已记录10次创建,如果间隔在单位周期内，则退出主进程
    if (Date.now() - beginTime < CREATE_WORKER_PERIOD) {
      console.log(`[主进程]：过于频繁创建子进程，自动退出主进程!`)

      // 记录日志
      recordLog(
        `【主进程】${new Date()}\n过于频繁创建子进程，自动退出主进程\n\n`
      )
      process.exit(1)
    } else {
      // 重新计数
      beginTime = 0
      historyCount = 0
    }
  }

  // 创建子进程并进行心跳监控
  const worker = cluster.fork()
  const curWorker = {
    worker: worker,
    id: worker.id,
    pid: worker.process.pid,
    missed: 0,
    timerId: 0,
  }
  // 记录子进程
  workers[curWorker.id] = curWorker
  // 添加进连接处理队列
  handleTCPQueue.unshift({ id: curWorker.id, TCP: '' })
  handleWebSocketQueue.unshift({ id: curWorker.id, WebSocket: '' })

  // 监视子进程上线
  worker.on('online', function (worker) {
    // 初始化子进程tcp服务器
    curWorker.worker.send({ id: curWorker.id })
    // 心跳
    curWorker.timerId = setInterval(function () {
      // 三次没回应，杀之
      if (curWorker.missed === 3) {
        clearInterval(curWorker.timerId)
        console.log(
          `[主进程]：子进程(${curWorker.id}) pid=${curWorker.pid} 阻塞被【清除】！`
        )
        recordLog(`【主进程】${new Date()}\n子进程阻塞，被自动清除\n\n`)
        process.kill(curWorker.pid)
        return
      }
      // 开始心跳
      curWorker.missed++
      // log('ping')

      curWorker.worker.send({ state: `ping#${curWorker.pid}` })
    }, 1000)
    console.log(`[主进程]：子进程(${curWorker.id}) 已【启动】！`)
  })

  // 监视子进程回应心跳
  worker.on('message', function (msg) {
    // 子进程处理连接关闭通知主进程删除对应客户端连接
    if (msg.id && workers[msg.id] && msg.type) {
      const id = getHandleWorkerPos(curWorker.id, msg.type)
      const handleQueue =
        msg.type === 'TCP' ? handleTCPQueue : handleWebSocketQueue
      console.log(
        `[主进程]：子进程(${handleQueue[id].id}) 已关闭${
          handleQueue[id][msg.type]
        }连接！`
      )
      handleQueue[id][msg.type] = ''
    }

    // 确认心跳回应
    if (msg.state === `pong#${curWorker.pid}`) {
      curWorker.missed = --curWorker.missed < 0 ? 0 : curWorker.missed
    }

    // 确认是否重启子进程服务，立即重启
    if (msg.act === `restart`) {
      createWorker()
    }
  })

  // 挂了就没必要再进行心跳了
  worker.on('exit', function () {
    clearInterval(curWorker.timerId)
    delete workers[curWorker.id]
  })
  return workers[curWorker.id]
}

// 创建 tcp 服务器
// let tcpServer = tcp.createServer({ pauseOnConnect: true })
let tcpServer = tcp.createServer()

// tcp 服务器绑定端口，并开始监听
tcpServer.listen(8888, '0.0.0.0')

// tcp 服务器开始监听触发
tcpServer.on('listening', () => {
  const address = tcpServer.address()
  console.log(
    `[主进程]：启动【TCP】服务器 监听 ${address.address}:${address.port}`
  )
})

// 发送拦截
function send(msg) {
  // console.log(`------------------------------------------------------------------------------------
  // -----------------\r\n${msg.toString('hex')}\r\n`);
  webSocket.send(msg)
}

// 处理图像函数
function handleImgData(msg) {
  let startPos = msg.indexOf(startBuffer)
  let endPos = msg.indexOf(endBuffer)

  // 1. 都没有标记
  if (startPos === -1 && endPos === -1) {
    // 判断是否以00开头和结尾，如果是，则抛弃数据,不是则判断是否存在缓存数据
    let tmpStartPos = msg.indexOf(invalidBuffer)
    let tmpEndPos = msg.lastIndexOf(invalidBuffer)
    if (tmpStartPos === 0 && tmpEndPos === msg.length - 1) {
      // 抛弃本次数据，并清空缓存数据,结束
      return (resBuffer = Buffer.from(''))
    } else if (resBuffer.length) {
      // 存在缓存数据，追加整条数据，如果不存在，则都跳过
      resBuffer = Buffer.concat([resBuffer, msg], resBuffer.length + msg.length)
    }
    return
  }

  // 2.都存在标记
  if (startPos !== -1 && endPos !== -1) {
    // 1.判断结束标记是否在开始标记之前，如果是则判断是否有缓存数据
    if (endPos < startPos) {
      // 结束标记位于开始标记之前，则判断缓存
      if (resBuffer.length) {
        // 存在缓存，则拼接缓存，发送新帧
        const res = msg.slice(0, endPos + 4)
        send(Buffer.concat([resBuffer, res], resBuffer.length + res.length))
        // 清除缓存，再更新结束标记位置
        resBuffer = Buffer.from('')
      }
      // 不存在缓存则，直接抛弃结束标记，再更新结束标记位置
      endPos = msg.indexOf(endBuffer, startPos + 4)
    }
    // 缓存已空
    // 2.此时，开始标记有效，结束标记还需判断有效性
    if (endPos !== -1) {
      // 结束标记依然有效，则，找到结束标记前最近的开始标记
      let preStartPos = startPos
      while (startPos !== -1 && startPos < endPos) {
        preStartPos = startPos
        startPos = msg.indexOf(startBuffer, startPos + 4)
      }
      // 没找到或者在结束标记之后，都不属于本帧.重新赋值开始标记有效位置
      startPos = preStartPos
      // 此时都有效，并且是最佳帧

      // 发送有效帧
      send(msg.slice(startPos, endPos + 4))
      // 之后，开始和结束标记都未知，所以要从头开始判断有效性，可用尾递归进行
      return handleImgData(msg.slice(endPos + 4))
    } else {
      // 结束标记无效，开始标记有效，则找到最尾的开始标记，并保存缓存
      startPos = msg.lastIndexOf(startBuffer, startPos)
      // 保存进缓存，之后返回
      resBuffer = msg.slice(startPos)
      return
    }
  }

  // 3.只存在一个标记
  // 只存在开始标记,则找到最后一个开始标记，并保存进缓存
  if (startPos !== -1) {
    // 结束标记无效，开始标记有效，则找到最尾的开始标记，并保存缓存
    startPos = msg.lastIndexOf(startBuffer, startPos)
    // 替换，不需要管上次是否有缓存，之后返回
    resBuffer = msg.slice(startPos)
    return
  }
  // 只存在结束标记,判断是否有缓存，如果有，则拼接并返回前端再清空缓存，没有则跳过
  if (endPos !== -1) {
    if (resBuffer.length) {
      const res = msg.slice(0, endPos + 4)
      // 存在缓存，拼接
      send(Buffer.concat([resBuffer, res], resBuffer.length + res.length))
      // 清空缓存
      resBuffer = Buffer.from('')
      return
    }
  }
  // 结束
}

// 收到连接，进行分发个进程
tcpServer.on('connection', (socket) => {
  const rinfo = socket.address()
  tcpSocket = socket
  console.log(
    `[主进程]：建立新的 TCP 连接，远程客户端地址 ${rinfo.address}:${rinfo.port}`
  )
  // return dispatchConnection(socket, `${rinfo.address}:${rinfo.port}`, 'TCP')
  // 设置超时时间
  socket.setTimeout(1000 * 60)
  socket.on('timeout', () => {
    log(
      `[主进程]：远程客户端 ${rinfo.address}:${rinfo.port} [连接超时准备关闭]`
    )
    socket.end()
    socket.destroy()
  })
  // tcp 服务器绑定端口，并开始监听
  socket.on('data', (msg) => {
    if (!webSocket) return
    //console.log(`[主进程]：收到远程客户端 ${rinfo.address}:${rinfo.port} 消息`)
    handleImgData(msg)
    console.log('send img')
  })
  socket.on('error', () => {
    console.log(
      `[主进程]：远程客户端 ${rinfo.address}:${rinfo.port} [客户端错误准备关闭连接]`
    )
    socket.destroy()
  })
  socket.on('end', () => {
    console.log(
      `[主进程]：远程客户端 ${rinfo.address}:${rinfo.port} [远程客户端主动请求关闭连接]`
    )
  })
  socket.on('close', (had_error) => {
    if (had_error) {
      console.log(
        `[主进程]：远程客户端 ${rinfo.address}:${rinfo.port} [发生传输错误关闭连接]`
      )
    } else {
      console.log(
        `[主进程]：远程客户端 ${rinfo.address}:${rinfo.port} [关闭连接]`
      )
    }
  })
})

// tcp 服务器出错
tcpServer.on('error', () => {
  console.log(`[主进程]：【TCP】服务器 出错`)
})

// tcp 服务器关闭
tcpServer.on('close', () => {
  console.log(`[主进程]：【TCP】服务器 关闭`)
  // // 重启tcp服务器
  // tcpServer = tcp.createServer({ pauseOnConnect: true })
  // // tcp 服务器绑定端口，并开始监听
  // tcpServer.listen(8088, '192.168.1.6')
  // console.log(`[主进程]：重启【TCP】服务器`)
})

/* 创建 webSocket 服务器 */
let webSocketServer = new ws.Server({
  host: localhost,
  port: 8889,
})

let wsInterval = 0

function keepConnect() {
  wsInterval = setInterval(() => {
    webSocketServer.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate()
      ws.isAlive = false
    })
  }, 30000)
}

// 开始监听端口
// webSocket 服务器开启监听事件
webSocketServer.on('listening', () => {
  console.log(`[主进程]：启动【WebSocket】服务器 监听 ${8889} 端口`)
  keepConnect()
})

// 接收到连接
webSocketServer.on('connection', (socket, request) => {
  webSocket = socket
  // console.log(request.headers);
  console.log(`[主进程]：【WebSocket】建立新连接 ${request.headers.host}`)
  // dispatchConnection(socket, `${request.headers.host}`, 'WebSocket')
  // 发送心跳包
  socket.send('ping')
  socket.on('message', (str) => {
    console.log(`[主进程]：【WebSocket】收到文本数据 ${str.toString('utf-8')}`)
    // 心跳维持
    if (str.toString('utf-8') === 'pong') {
      return setTimeout(() => {
        socket.send('ping')
        socket.isAlive = true
      }, 3000)
    }
  })

  // WebSocket 连接出错
  socket.on('error', (err) => {
    webSocket = null
    console.log(`[主进程]：【WebSocket】连接出错`)
    socket.close()
  })
  // WebSocket 连接关闭
  socket.on('close', (code, reason) => {
    // console.log(JSON.stringify(code), reason)
    webSocket = null
    console.log(`[主进程]：【WebSocket】连接关闭`)
    // 通知主进程删除当前连接
    // process.send({ id: worker.id, type: 'WebSocket' })
  })
})

// webSocket 服务器出错事件
webSocketServer.on('error', (err) => {
  console.log(`[主进程]：【WebSocket】 服务器出错`)
})

// webSocket 服务器关闭事件
webSocketServer.on('close', () => {
  console.log(`[主进程]：【WebSocket】 服务器关闭`)
  clearInterval(wsInterval)
  /* 创建 webSocket 服务器 */
  setTimeout(() => {
    webSocketServer = ws.Server({
      host: localhost,
      port: 8889,
    })
  }, 1000)
  // 开始监听端口
  // webSocketServer.listen(8089, '192.168.1.6')
  console.log(`[主进程]：重启【WebSocket】服务器`)
})

/* 主进程事件 */
// 未知错误 记录日志并退出进程
process.on('uncaughtException', (err, origin) => {
  console.log(`[主进程]：发生【错误】!`)

  // 记录日志
  recordLog(
    `【主进程】${new Date()}\n捕获的异常: ${err}\n异常的来源: ${origin}\n\n`
  )
  process.exit(1)
})

// 退出主进程
process.on('exit', (code) => {
  console.log(`[主进程]：【退出】退出码 ${code}！`)

  // 清除所有子进程
  const allChildWorker = Object.values(workers)
  for (const childWorker of allChildWorker) {
    childWorker.worker.kill()
  }
  console.log(`[主进程]：共清除 ${allChildWorker.length} 个子进程！`)
})

// 主进程fork事件
cluster.on('fork', (worker) => {
  console.log(`[主进程]：开始【创建】子进程(${worker.id})...`)
})

// 子进程退出
cluster.on('exit', (worker, code, signal) => {
  console.log(
    `[主进程]：子进程(${worker.id}) 已被信号 ${signal}杀死，退出码 ${code}，【退出】!`
  )
  handleTCPQueue.splice(getHandleWorkerPos(worker.id, 'TCP'), 1)
  handleWebSocketQueue.splice(getHandleWorkerPos(worker.id, 'WebSocket'), 1)
  delete workers[worker.id]
  // 根据当前子进程数是否超限来进行创建
  if (Object.values(workers).length < MAX_CHILD_WORKER_COUNT) {
    // 恢复子进程
    setTimeout(() => {
      createWorker(tcpSocket)
    }, 2000)
  }
})

// app.use(async (ctx) => {
//   ctx.body = info
// })

// router.get('/', (ctx, next) => {
//   ctx.body = ctx.request.query
//   // await ctx.render('index')
// })

// 腾讯sdk数据状态接口
router.post('/receive', (ctx, next) => {
  const body = ctx.request.body
  if (body.payload && body.payload.params && webSocket) {
    // console.log(body)
    // 同步数据回传给客户端
    webSocket.send(
      JSON.stringify({
        type: 'states',
        data: body,
      })
    )
  }
})

// 小车移动
router.post('/move', (ctx, next) => {
  const body = ctx.request.body
  console.log(`@${JSON.stringify(body)}$`);

  if(isDebounce) return ctx.body ='debounce'
  // 防抖
  if(body.debounce){
    isDebounce=true
    setTimeout(() => {
      isDebounce=false
    }, 500);
  }
  
  putMove(`@@@@@@${JSON.stringify(body)}$`)
  ctx.body ='ok'
})

// 获取设备所有属性
router.get('/props/:DeviceName', async (ctx, next) => {
  try {
    var res = await getProps({ DeviceName: ctx.params.DeviceName })
  } catch (error) {}
  log(res)
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
  log(res)
  ctx.body = res
})

// 获取设备详情
router.get('/deviceDes/:DeviceName', async (ctx, next) => {
  try {
    var res = await getDeviceDes({ DeviceName: ctx.params.DeviceName })
  } catch (error) {}
  log(res)
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
  log(res)
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
  log(res)
  ctx.body = res
})

// 创建、删除设备
router.put('/putDevice', async (ctx, next) => {
  const body = ctx.request.body
  try {
    var res = await putDevice({ DeviceName: body.DeviceName }, body.isCreate)
  } catch (error) {}
  log(res)
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
  log(res)
  ctx.body = res
})

app
  .use(cors())
  .use(bodyParser())
  .use(staticFiles(path.resolve(__dirname, './iotc/')))
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(4444, () => {
  log(`HTTP server is listening in ${process.env.domain}:4444`)
})

// 获取属性数据
function getProps(params) {
  params = Object.assign({}, myConfig.params, params)
  return client.DescribeDeviceData(params)
}

// 获取历史属性值
function getHistoryPropValue(params) {
  params = Object.assign(
    {
      MinTime: Date.now() - 1000*60,
      MaxTime: Date.now(),
      Limit: 30,
      FieldName: 'cur_speed_whole',
    },
    myConfig.params,
    params
  )
  return client.DescribeDeviceDataHistory(params)
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
  return client.DescribeDevice(params)
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
  return client.GetDeviceList(params)
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
    ? client.CallDeviceActionAsync(params)
    : client.CallDeviceActionSync(params)
}

// 创建、删除设备
function putDevice(params, isCreate = true) {
  const params = {
    ProductId: 'K8LG8U17CW',
    DeviceName: 'test2',
  }
  return isCreate ? client.CreateDevice(params) : client.DeleteDevice(params)
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
  return client.PublishMessage(params)
}

// 小车移动指令，通过透传到wifi2
function putMove(command) {
  return tcpSocket&&tcpSocket.write(command)
}
