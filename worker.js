/* 子进程 */

const fs = require('fs')
const path = require('path')
const recordLog = require('./log.js')

/* 变量定义 */

// 进程最大内存占用
const MAX_MEMORY_USAGE = 1024 * 1024 * 50

// 子进程
const worker = {}
let server = null

/* 处理 */
// 启动upd服务
function openUdpServer(udpServer) {
  // let arr = []
  server = udpServer
  // udp 服务器绑定端口，并开始监听
  udpServer.on('message', (msg, rinfo) => {
    // console.log(dat.toString())
    // arr.push(Array(~~Math.random() * 1000).fill('sss'.repeat(100)))
    // console.log(`<子进程${worker.id}>：收到udp请求 >>>: ${msg.toString()}`)
    // setInterval(()=>{
    udpServer.send(
      Buffer.from(Math.ceil(Math.random() * 100) + ''),
      rinfo.port,
      rinfo.address,
      () => {}
    )
    // },500)
  })
}

/* 子进程事件 */

// 监听主进程传递的【消息】
process.on('message', (msg, udpServer) => {
  // console.log(
  //   `<子进程${worker.id}>：收到主进程消息 >>>: ${JSON.stringify(msg)}`
  // )
  // while (1);

  // 记录进程序号，限首次
  if (!worker.id && msg.id) {
    worker.id = msg.id
    openUdpServer(udpServer)
  }

  // 回应心跳
  if (msg.state === `ping#${process.pid}`) {
    // console.log('pong')
    process.send({ state: `pong#${process.pid}` })
  }

  console.log(`<子进程${worker.id}>：内存占用 ${process.memoryUsage().rss}`)

  // 内存使用过多，自杀
  if (process.memoryUsage().rss > MAX_MEMORY_USAGE) {
    console.log(`<子进程${worker.id}>：内存占用过多，自动退出！`)
    recordLog(
      `【子进程】${new Date()}\n内存占用过多 ${(
        process.memoryUsage().rss /
        1024 /
        1024
      ).toFixed(2)} M\n\n`
    )

    // 退出进程前，先通知主进程创建新的服务
    process.send({ act: 'restart' })

    process.exit(1)
  }
})

// 未知错误 记录日志并退出进程
process.on('uncaughtException', (err, origin) => {
  console.log(`<子进程${worker.id}>：发生【错误】!`)

  // 记录日志
  recordLog(
    `【子进程】${new Date()}\n捕获的异常: ${err}\n异常的来源: ${origin}\n\n`
  )

  // 退出进程前，先通知主进程创建新的服务
  process.send({ act: 'restart' })

  // 关闭当前服务，停止结束连接，关闭后退出进程
  server.close(() => {
    // 手动退出
    process.exit(1)
  })
})

// 退出工作进程触发
// process.on('exit', (code, signal) => {
//   if (signal) {
//     console.log(`<子进程${worker.id}>：【退出】被信号 ${signal} 杀死！`)
//   } else if (code !== 0) {
//     console.log(`<子进程${worker.id}>：【退出】退出码 ${code}！`)
//   } else {
//     console.log(`<子进程${worker.id}>：【正常退出】！`)
//   }
// })
// process.send('8')

// console.log('worker');
// http
//   .createServer((req, res) => {
//     console.log('http')
//     res.writeHead(200, { 'content-type': 'application/json' })
//     res.end(JSON.stringify(info))
//   })
//   .listen(8888)
// process.exit(1)
