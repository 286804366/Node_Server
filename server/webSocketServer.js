/* webSocket */
const ws = require('ws')
// 导入配置
const { wsConfig } = require('../config/serverConfig.js')

let webSocket = null
let wsInterval = 0

/* 创建 webSocket 服务器 */
let webSocketServer = new ws.Server({
  host: wsConfig.host,
  port: wsConfig.port,
})

function keepConnect() {
  wsInterval = setInterval(() => {
    webSocketServer.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate()
      ws.isAlive = false
    })
  }, wsConfig.connectTimeout)
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
      }, wsConfig.pingPongInterval)
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
      host: wsConfig.host,
      port: wsConfig.port,
    })
  }, wsConfig.restartTimeout)
  // 开始监听端口
  // webSocketServer.listen(8089, '192.168.1.6')
  console.log(`[主进程]：重启【WebSocket】服务器`)
})

// 通过websocket发送数据
function sendDataByWebSocket(data){
  if(webSocket){
    webSocket.send(data)
  }
}

// 检测是否有websocket连接
function hasWebSocketConnect(){
  return webSocket
}

// 导出websocket服务器实例和连接实例
module.exports = {
  webSocketServer,
  sendDataByWebSocket,
  hasWebSocketConnect
}
