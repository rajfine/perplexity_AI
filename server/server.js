import 'dotenv/config'
import connectToDB  from './src/config/database.js'
import app from './src/app.js'
import http from 'http'
import { initSocket } from './src/sockets/server.socket.js'

const httpServer = http.createServer(app)
initSocket(httpServer)

const PORT = process.env.PORT
connectToDB()
  .catch((err)=>{
    console.log("MongoDB connection failed:", err)
    process.exit(1)
  })

httpServer.listen(PORT, ()=>{
  console.log(`server is running on port ${PORT}`)
})
