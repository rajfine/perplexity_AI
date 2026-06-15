import {Server, Socket} from 'socket.io'

let io;

export const initSocket = (httpServer)=>{
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]
    .filter(Boolean)
    .join(",")
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
