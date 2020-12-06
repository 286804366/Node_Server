/* HTTP Server */
const Koa = require('koa')
const app = new Koa()

// app.listen(3000)

/* TCP Server */
const dgram = require('dgram')
const http = require('http')
// const tcp = require('net')
const os = require('os')
const cpus = os.cpus()

const cluster = require('cluster')
const cp = require('child_process')

const subprocess = require('child_process').fork('subprocess.js')

// 打开 server 对象，并发送该句柄。
// const server = require('net').createServer();
// server.listen(4000, () => {
//   subprocess.send('server', server);
// });

const server = require('dgram').createSocket({
  type: 'udp4',
  reuseAddr: true,
})
server.bind(4000, () => {
  subprocess.send('udp', server)
})
// server.on('message', (msg,rinfo) => {
//   console.log('收到数据')
//   server.send(msg.toString(), rinfo.port, rinfo.address, () => {})
// })

// const workers = {}

// for (let i = 0; i < 2; i++) {
//   const worker = cp.fork('worker.js')
//   workers[worker.pid] = worker
// }
// // 创建udp服务器
// const udpServer = dgram.createSocket({ type: 'udp4' , reuseAddr: true})
// // udp 服务器绑定端口，并开始监听
// udpServer.bind(4000)
// // const udpServer = udpServer.createServer()
// // udp 服务器开始监听触发
// udpServer.on('listening', () => {
//   const address = udpServer.address()
//   for (const key in workers) {
//     workers[key].send('tcp',udpServer,(e)=>{
//       console.log(e);
//     })
//   }
//   console.log(Object.keys(workers));
//   console.log(`udp 服务器监听 ${address.address}:${address.port}`)
// })

// if (cluster.isMaster) {
//   cluster.setupMaster({
//     exec: 'worker.js',
//     // inspectPort :4000
//   })
//   for (let i = 0; i < 2; i++) {
//     const worker = cluster.fork()
//     workers[worker.id] = worker
//   }
// }

// 主进程fork事件
cluster.on('fork', (worker) => {
  console.log(`主进程:fork`)
})
// 主进程online事件
cluster.on('online', () => {
  console.log(`主进程:online工作进程已上线`)
})
// 主进程setup事件
cluster.on('setup', () => {
  console.log(`主进程:setup，调用fork或者setupMaster`)
})
// 主进程exit事件
cluster.on('exit', () => {
  console.log(`主进程:exit工作进程退出`)
})
// 主进程disconnect事件,工作进程断开IPC连接触发,可能工作进程关闭
cluster.on('disconnect', () => {
  console.log('主进程:disconnect工作进程已断开连接')
})
// 进程发生错误触发
cluster.on('error', () => {
  console.log('主进程:error')
})

// 主进程listening事件，工作进程调用服务器listen时发送给主进程listening时触发，共享socket
cluster.on('listening', (address) => {
  console.log(`主进程：listening工作进程正在监听端口`)
})

cluster.on('message', (msg) => {
  console.log(`[主进程]收到[工作进程]传递的消息:${msg}`)
})

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
