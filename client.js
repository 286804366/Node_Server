const dgram = require('dgram')

const udpServer = dgram.createSocket('udp4')
const str =Buffer.from('ok')
udpServer.send(str, 4000, '127.0.0.1', () => {})
udpServer.on('message', (msg,rinfo) => {
  console.log('收到数据')
  // server.send(msg.toString(), rinfo.port, rinfo.address, () => {})
})