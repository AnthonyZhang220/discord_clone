const path = require('path')
const express = require('express')
const http = require('http')
const app = express();

const socketio = require('socket.io')
const server = http.createServer(app)

const io = socketio(server, {
    cors: {
        origin: "http://localhost:5000"
    }
})

app.use(express.static(path.join(__dirname, 'public')))


io.on('connection', socket => {
    console.log("new connection")

    socket.emit('message', "Welcome to ChatCord!")

    //broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat');

    //run when client disconnects
    socket.on('disconnect', () => {
        io.emit("message", 'a user has left the chat')
    });

    //listen for chatMessage
    socket.on('chatMessage', (message) => {
        io.emit('message', message);
    })

});
const PORT = 3000 || process.env.PORT;


server.listen(PORT, () => console.log('Server runing on 3000!'))