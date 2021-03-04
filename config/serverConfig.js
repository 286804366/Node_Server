
// websocket 服务器配置
const wsConfig = {
  host:'127.0.0.1',
  port:8889,
  // websocket重启延时
  restartTimeout:1000,
  // 心跳包间隔
  pingPongInterval:3000,
  // 连接超时时长
  connectTimeout:30*1000,
}

// tcp 服务器配置
const tcpConfig = {
  host:'0.0.0.0',
  port:8888,
  timeout:1000*60,
  // tcp 服务器重启延时
  restartTimeout:1000*2
}

// http 服务器配置
const httpConfig = {
  host:'127.0.0.1',
  port:4444
}

module.exports = {
  wsConfig,
  tcpConfig,
  httpConfig
}