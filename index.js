/* HTTP Server */
const Koa = require('koa')
const app = new Koa()


/* TCP Server */
const dgram = require('dgram')
const http = require('http')
// const tcp = require('net')
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
const MAX_CHILD_WORKER_COUNT = 2 || Math.ceil(cpus.length)
// 创建子进程记录周期
const CREATE_WORKER_PERIOD = 1000 * 60
// 单位周期内最多创建的子进程数，超过则退出主进程
const CREATE_WORKER_PER_MAX_COUNT = 30

let beginTime = 0
let historyCount = 0

cluster.setupMaster({
  exec: './worker.js',
})

// 创建udp服务器
const udpServer = dgram.createSocket({ type: 'udp4', reuseAddr: true })

// udp 服务器绑定端口，并开始监听
udpServer.bind(4000)

// udp 服务器开始监听触发
udpServer.on('listening', () => {
  const address = udpServer.address()
  // 创建udp多进程
  for (let i = 0; i < MAX_CHILD_WORKER_COUNT; i++) {
    createUdpWorker(udpServer)
  }
  

  console.log(
    `[主进程]：启动【UDP】服务器 监听 ${address.address}:${address.port}`
  )
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

/* 集群事件 */
// 主进程收到子进程消息
// cluster.on('message', (msg) => {
//   console.log(`[主进程]：收到子进程消息 ${JSON.stringify(msg)}`)
// })

// 主进程setup事件
// cluster.on('setup', (worker) => {
//   console.log(`[主进程]：从${worker.exec}【创建】进程！`)
// })

// 主进程fork事件
cluster.on('fork', (worker) => {
  console.log(`[主进程]：开始【创建】子进程(${worker.id})...`)
})

// 主进程online事件
// cluster.on('online', (worker) => {
//   console.log(`[主进程]：子进程(${worker.id}) 已【启动】！`)
// })

// 主进程listening事件，工作进程调用服务器listen时发送给主进程listening时触发，共享socket
// cluster.on('listening', (worker, address) => {
//   console.log(`[主进程]：子进程(${worker.id}) 开始监听 ${address.port} 端口`)
// })

// 主进程disconnect事件,工作进程断开IPC连接触发,可能工作进程关闭
// cluster.on('disconnect', (worker) => {
//   console.log(`[主进程]：子进程(${worker.id}) 已【断开】连接!`)
// })

// 子进程退出
cluster.on('exit', (worker, code, signal) => {
  console.log(
    `[主进程]：子进程(${worker.id}) 已被信号 ${signal}杀死，退出码 ${code}，【退出】!`
  )

  // 根据当前子进程数是否超限来进行创建
  if (Object.values(workers).length < MAX_CHILD_WORKER_COUNT) {
    // 恢复子进程
    setTimeout(() => {
      createUdpWorker(udpServer)
    }, 2000)
  }
})

// 创建子进程
function createUdpWorker(udpServer) {
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

  // 监视子进程上线
  worker.on('online', function (worker) {
    // 初始化子进程udp服务器
    curWorker.worker.send({ id: curWorker.id }, udpServer)
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
      // console.log('ping')

      curWorker.worker.send({ state: `ping#${curWorker.pid}` })
    }, 1000)
    console.log(`[主进程]：子进程(${curWorker.id}) 已【启动】！`)
  })

  // 监视子进程回应心跳
  worker.on('message', function (msg) {
    // console.log(Object.keys(workers).join(','))

    // 确认心跳回应
    if (msg.state === `pong#${curWorker.pid}`) {
      curWorker.missed = --curWorker.missed < 0 ? 0 : curWorker.missed
    }

    // 确认是否重启子进程服务，立即重启
    if (msg.act === `restart`) {
      createUdpWorker(udpServer)
    }
  })

  // 挂了就没必要再进行心跳了
  worker.on('exit', function () {
    clearInterval(curWorker.timerId)
    delete workers[curWorker.id]
  })
  return workers[curWorker.id]
}

// // 创建udp服务器
// const udpServer = dgram.createSocket({ type: 'udp4', reuseAddr: true })

// let info = 'info'

// const clientState = {
//   address: '127.0.0.1',
//   family: 'IPv4',
//   port: 4001,
//   size: 1,
// }
// // udp 服务器接收请求数据
// udpServer.on('message', function (msg, rinfo) {

//   console.log(`服务器收到:${msg} 来自 ${rinfo.address}:${rinfo.port}`)
//   Object.assign(clientState, rinfo)
//   info = msg.toString()
//   // socket.send(msg[, offset, length][, port][, address][, callback])
//   udpServer.send('me', 4001, '127.0.0.1', () => {})
// })
// // udp 服务器已连接，socket 与远程地址关联
// udpServer.on('connect', function (msg, rinfo) {
//   console.log('connect:udp 服务器已连接，socket 与远程地址关联')
// })

// // udp 服务器关闭触发
// udpServer.on('close', () => {
//   console.log('close:udp 服务器')
// })

// // udp 服务器异常触发
// udpServer.on('error', (error) => {
//   console.log('error:udp 服务器异常', error)
// })

// // udp 服务器开始监听触发
// udpServer.on('listening', () => {
//   const address = udpServer.address()
//   const recvSize = udpServer.getRecvBufferSize()
//   const sendSize = udpServer.getSendBufferSize()

//   console.log(
//     `接收缓冲区buffer大小:${recvSize}  发送缓冲区buffer大小:${sendSize}`
//   )
//   console.log(`udp 服务器监听 ${address.address}:${address.port}`)
// })

// // udp 服务器绑定端口，并开始监听
// udpServer.bind(4000)

// app.use(async (ctx) => {
//   ctx.body = info
// })
