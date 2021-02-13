/* 子进程 */

const fs = require('fs')
const path = require('path')
const tcp = require('net')
const recordLog = require('./log.js')
const ws = require('ws')

/* 变量定义 */

// 进程最大内存占用
const MAX_MEMORY_USAGE = 1024 * 1024 * 50
const IMG_BUF = []

// 子进程
const worker = {}
// tcp 连接套接字
let tcpSocket = null
// WebSocket 连接套接字
let webSocket = null
// WebSocket 二进制流数据
let webSocketData = Buffer.from('')

const imgData = []
const resImgData = []
const str = 'FDFAFFD9SGSGFSFSRFFD8MHGLNMLFFD9000FFD8KNBVLNVBKFFD9BV000'

/* 图像处理 */
function imgHandle(imgStr) {
  let startPos = imgStr.indexOf('ffd8')
  let endPos = imgStr.indexOf('ffd9')

  // 1.都没有开头结束标志，则直接存放，并跳过处理
  if (startPos === -1 && endPos === -1) {
    // 存在开始数据
    if (resImgData.length) resImgData.push(imgStr)
    return
  }

  // 2.开头和结束标记都有
  if (startPos !== -1 && endPos !== -1) {
    // 结束标记在开始标记之前，则判断为上一帧残留数据
    if (endPos < startPos) {
      resImgData.push(imgStr.slice(0, endPos + 4))
      if (resImgData.length > 1) imgData.push(resImgData.join(''))
      resImgData.length = 0
    }
    endPos = imgStr.indexOf('ffd9', startPos) // 查找当前帧结束标记
    while (endPos > startPos) {
      // 找到当前帧结束标记
      imgData.push(imgStr.slice(startPos, endPos + 4))
      // 更新新帧索引
      startPos = imgStr.indexOf('ffd8', endPos + 4)
      if (startPos !== -1) {
        endPos = imgStr.indexOf('ffd9', startPos + 4)
      } else break
    }
  }

  // 3.只有开始标记
  if (startPos !== -1) {
    return resImgData.push(imgStr.slice(startPos))
  }

  // 4.只有结束标记
  if (endPos !== -1) {
    resImgData.push(imgStr.slice(0, endPos + 4))
    if (resImgData.length > 1) imgData.push(resImgData.join(''))
    return (resImgData.length = 0)
  }
}

// console.log(imgHandle(str));
// console.log(imgData);

/* 处理 */
/* 启动 TCP 服务处理 */
function openTCPServer(socket) {
  // let arr = []
  tcpSocket = socket
  const rinfo = socket.address()
  // 设置超时时间
  socket.setTimeout(1000 * 60)
  socket.on('timeout', () => {
    console.log(
      `<子进程${worker.id}>：远程客户端 ${rinfo.address}:${rinfo.port} [连接超时准备关闭]`
    )
    socket.end()
    socket.destroy()
  })
  // tcp 服务器绑定端口，并开始监听
  socket.on('data', (msg) => {
    // const imgBuf = msg.toString('hex')
    // imgHandle(imgBuf)
    // imgData.forEach((img) => {
    //   fs.writeFile(
    //     `./img/${Date.now()}.jpg`,
    //     Buffer.from(img, 'hex'),
    //     function (err) {
    //       if (err) {
    //         console.log(err)
    //       }
    //     }
    //   )
    // })
    // imgData.length = 0
    // console.log(`<子进程${worker.id}>：收到tcp请求 >>>: ${imgBuf.length}`)
    console.log(
      `<子进程${worker.id}>：远程客户端 ${rinfo.address}:${rinfo.port}`
    )
    // setInterval(()=>{
    // tcpServer.write(
    //   Buffer.from(Math.ceil(Math.random() * 100) + ''),
    //   () => {}
    // )
  })
  socket.on('error', () => {
    console.log(
      `<子进程${worker.id}>：远程客户端 ${rinfo.address}:${rinfo.port} [客户端错误准备关闭连接]`
    )
    socket.destroy()
  })
  socket.on('end', () => {
    console.log(
      `<子进程${worker.id}>：远程客户端 ${rinfo.address}:${rinfo.port} [远程客户端主动请求关闭连接]`
    )
  })
  socket.on('close', (had_error) => {
    if (had_error) {
      console.log(
        `<子进程${worker.id}>：远程客户端 ${rinfo.address}:${rinfo.port} [发生传输错误关闭连接]`
      )
    } else {
      console.log(
        `<子进程${worker.id}>：远程客户端 ${rinfo.address}:${rinfo.port} [关闭连接]`
      )
    }
    process.send({ id: worker.id, type: 'TCP' })
  })
}

/* 启动 WebSocket 服务处理 */
function openWebSocketServer(socket) {
  webSocket = socket
  // WebSocket 收到客户端文本内容
  socket.on('message', (str) => {
    console.log(
      `<子进程${worker.id}>：【WebSocket】服务器收到文本数据 ${str.toString(
        'hex'
      )}`
    )
    socket.send(str)
  })

  // WebSocket 连接出错
  socket.on('error', (err) => {
    console.log(`<子进程${worker.id}>：【WebSocket】服务器连接出错`)
    socket.close()
  })
  // WebSocket 连接关闭
  socket.on('close', (code, reason) => {
    console.log(`<子进程${worker.id}>：【WebSocket】服务器连接关闭`)
    // 通知主进程删除当前连接
    process.send({ id: worker.id, type: 'WebSocket' })
  })
}

/* 子进程事件 */
// 监听主进程传递的【消息】
process.on('message', (msg, socket) => {
  // console.log(
  //   `<子进程${worker.id}>：收到主进程消息 >>>: ${JSON.stringify(msg)}`
  // )

  // 记录进程序号，限首次
  if (!worker.id && msg.id) {
    worker.id = msg.id
  }

  // 启动 TCP 连接处理
  if (msg.type === 'TCP' && socket) {
    openTCPServer(socket)
  }
  // 启动 WebSocket 连接处理
  if (msg.type === 'WebSocket' && socket) {
    openWebSocketServer(socket)
  }

  // 回应心跳
  if (msg.state === `ping#${process.pid}`) {
    // console.log('pong')
    process.send({ state: `pong#${process.pid}` })
  }

  //console.log(`<子进程${worker.id}>：内存占用 ${process.memoryUsage().rss}`)

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
  if (tcpSocket) {
    tcpSocket.end(() => {
      // 手动退出
      process.exit(1)
    })
  }

  // 关闭当前服务，停止结束连接，关闭后退出进程
  if (webSocket) {
    webSocket.terminate()
    setTimeout(() => {
      // 手动退出
      process.exit(1)
    }, 500)
  }
})

// console.log('worker');
// http
//   .createServer((req, res) => {
//     console.log('http')
//     res.writeHead(200, { 'content-type': 'application/json' })
//     res.end(JSON.stringify(info))
//   })
//   .listen(8888)
// process.exit(1)
