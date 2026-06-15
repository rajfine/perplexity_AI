import {Server, Socket} from 'socket.io'

let io;

export const initSocket = (httpServer)=>{
  const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean)

  io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        credentials: true,
      }
  })

  console.log("socket.io server is running")

  io.on("connection",(socket)=>{
    console.log("user is connected: " + socket.id)
  })
}

export function getIo(){
  if(!io){
    throw new Error("socket.io has not been initialized")
  }
  return io
}
