// const dgram = require('dgram')
// const http = require('http')
// let info = 's'
// 创建udp服务器
// const udpServer = dgram.createSocket({ type: 'udp4', reuseAddr: true })
// udp 服务器开始监听触发
// udpServer.on('listening', () => {
//   const address = udpServer.address()
//   console.log(`udp 服务器监听 ${address.address}:${address.port}`)
// })

// const os = require('os')
// const cpus = os.cpus()

// let cluster = clusters.worker
process.on('message', (server) => {
  console.log(arguments);
  console.log(`工作线程：message :${JSON.stringify(server)}`)
    // server.on('connection', (socket) => {
    //   socket.end('由子进程处理');
    // });
  // info = server
  // e.on('message')
  // udp 服务器绑定端口，并开始监听

})
process.on('online', (msg) => {
  console.log(`工作线程：online`)
})
process.on('listening', (msg) => {
  console.log(`工作线程：listening`)
})
// 与主进程断开IPC连接触发
process.on('disconnect', () => {
  console.log('工作进程:disconnect工作进程已断开连接')
})
// 进程发生错误触发
process.on('error', () => {
  console.log('工作进程:error工作进程发生错误')
})
// 退出工作进程触发
process.on('exit', (code, signal) => {
  if (signal) {
    console.log(`工作进程:exit工作进程已被信号 ${signal} 杀死`)
  } else if (code !== 0) {
    console.log(`工作进程:exit工作进程退出，退出码: ${code}`)
  } else {
    console.log('工作进程:exit工作进程成功退出')
  }
})
// process.send('8')

// console.log('worker');
// process.exit(1)
// http
//   .createServer((req, res) => {
//     console.log('http')
//     res.writeHead(200, { 'content-type': 'application/json' })
//     res.end(JSON.stringify(info))
//   })
//   .listen(8888)
// console.log(cluster.worker);
// const udpServer = dgram.createSocket({ type: 'udp4', reuseAddr: true })
// udpServer.on('message', (msg, rinfo) => {
//   console.log(msg.toString())
//   udpServer.send('22', 4001, '127.0.0.1', (error) => {
//     console.log('send')
//   })
// })
// udpServer.on('listening', () => {
//   console.log(`listening:4000,${cluster.worker.id}`)
// })
// udpServer.bind(4000)
