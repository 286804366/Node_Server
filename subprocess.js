process.on('message', (m, server) => {
  console.log(m);
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.on('data', (data) => {
        console.log('收到数据');
        socket.write(data.toString())
      })
    })
  }else{
    server.on('message', (msg,rinfo) => {
      console.log('收到数据')
      server.send(msg.toString(), rinfo.port, rinfo.address, () => {})
    })
  }
})
