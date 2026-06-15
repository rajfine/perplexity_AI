import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import connectToDB  from './src/config/database.js'
import app from './src/app.js'
import http from 'http'
import { initSocket } from './src/sockets/server.socket.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const httpServer = http.createServer(app)
initSocket(httpServer)

const PORT = process.env.PORT || 3000
connectToDB()
  .catch((err)=>{
    console.log("MongoDB connection failed:", err)
    process.exit(1)
  })

httpServer.listen(PORT, ()=>{
  console.log(`server is running on port ${PORT}`)
})
