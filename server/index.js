const { db } = require('./db')
const PORT = process.env.PORT || 8080
const app = require('./app')
const seed = require('../script/seed');
const socket = require('socket.io');
const ws = require('ws')

const init = async () => {
  try {
    if(process.env.SEED === 'true'){
      await seed();
    }
    else {
      await db.sync()
    }
    // start listening (and create a 'server' object representing our server)
    const server = app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
    const io = socket(server);
    const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
    
    io.on('connection', function(socket){
      
      // Join a chat
      const { roomId } = socket.handshake.query;
      socket.join(roomId);

      // Listen for new messages
      socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
        io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
      });

      // Leave the chat if the user closes the socket
      socket.on("disconnect", () => {
        socket.leave(roomId);
      });
    })

    // let sockets = [];
    // const socketServer = new ws.Server({ server });
    // socketServer.on('connection', socket => {
    //   sockets.push(socket);
    //   console.log('length, ', sockets.length)
    //   socket.on('message', (message) => {
    //     sockets.filter(s => s !== socket).forEach(s => s.send(message.toString()));
    //   })
    //   socket.on('close', () => {
    //     sockets = sockets.filter(s => s !== socket)
    //   })
    // })

  } catch (ex) {
    console.log(ex)
  }
}

init()
