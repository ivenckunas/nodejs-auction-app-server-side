module.exports = io => {


  io.on("connect", socket => {

    socket.on('bid', data => {
      console.log(data)
      io.emit('bidData', data)
    })

  })

}