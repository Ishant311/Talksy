import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"]
  },
});

export const getRecieverSocketId = (userId) => { 
  return userSocketMap[userId];
}


//online users
const userSocketMap = {};

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);

    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("call-user", (data) => {
      io.to(userSocketMap[data.userToCall]).emit("incoming-call", { from: data.from, signal: data.signal });
    });
  
    socket.on("accept-call", (data) => {
      io.to(data.to).emit("call-accepted", data.signal);
    });


    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export { io, server, app };