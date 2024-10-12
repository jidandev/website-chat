const express = require('express');
   const http = require('http');
   const socketIo = require('socket.io');

   const app = express();
   const server = http.createServer(app);
   const io = socketIo(server, {
     cors: {
       origin: "*",
       methods: ["GET", "POST"]
     }
   });

   io.on('connection', (socket) => {
     console.log('New client connected');
     
     socket.on('sendMessage', (message) => {
       io.emit('receiveMessage', message);
     });

     socket.on('disconnect', () => {
       console.log('Client disconnected');
     });
   });

   const PORT = process.env.PORT || 4000;
   server.listen(PORT, () => {
     console.log(`Server listening on port ${PORT}`);
   });