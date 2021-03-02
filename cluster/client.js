const dgram = require('dgram')
const tcp = require('net')

const tcpClient = tcp.createConnection({
  port: 58266,
  host: '118.25.95.166',
})
tcpClient.on('connect', () => {
  const rinfo = tcpClient.address()
  console.log(`<Client>：连接建立 >>>: ${rinfo.address}:${rinfo.port}`)
  setInterval(() => {
    tcpClient.write('dd')
  }, 1000)
  tcpClient.on('data', (msg) => {
    console.log(`<Client>：收到tcp响应 >>>: ${msg.toString()}`)
    console.log(`<Client>：请求地址 ${rinfo.address}:${rinfo.port}`)
  })
  tcpClient.on('close', (had_error) => {
    if (had_error) {
      console.log(
        `<Client>：远程服务器 ${rinfo.address}:${rinfo.port} [发生错误关闭连接]`
      )
    } else {
      console.log(
        `<Client>：远程服务器 ${rinfo.address}:${rinfo.port} [关闭连接]`
      )
    }
  })
  // process.stdin.on('data', function (chunk) {
  //   setInterval(() => {
  //     tcpClient.write(chunk, () => {})
  //   }, 2000)
  // })
})
