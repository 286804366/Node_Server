const dgram = require('dgram')
const tcp = require('net')


const tcpClient = tcp.createConnection({
  port :8088,
  host:'192.168.1.6'
})
tcpClient.on('connect',()=>{
  const rinfo = tcpClient.address()
  // tcpClient.send(process.stdin, 4000, '192.168.146.129', () => {})
  tcpClient.on('data',(msg)=>{
    console.log(`<Client>：收到tcp响应 >>>: ${msg.toString()}`)
    console.log(`<Client>：请求地址 ${rinfo.address}:${rinfo.port}`)
  })
  tcpClient.on('close',(had_error)=>{
    if(had_error){
      console.log(`<Client>：远程服务器 ${rinfo.address}:${rinfo.port} [发生错误关闭连接]`)
    }else{
      console.log(`<Client>：远程服务器 ${rinfo.address}:${rinfo.port} [关闭连接]`)
    }
  })
  process.stdin.on('data', function (chunk) {
    setInterval(() => {
      tcpClient.write(chunk, () => {})
    }, 2000)
  })
})

