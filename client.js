const dgram = require('dgram')

const udpServer = dgram.createSocket('udp4')
const str = Buffer.from('ok')
process.stdin.on('data', function (chunk) {
  setInterval(() => {
    udpServer.send(chunk, 4000, '192.168.146.129', () => {})
  }, 500)
})
// udpServer.send(process.stdin, 4000, '192.168.146.129', () => {})
udpServer.on('message', (msg, rinfo) => {
  console.log(msg.toString())
  udpServer.send(msg.toString(), rinfo.port, rinfo.address, () => {})
})
