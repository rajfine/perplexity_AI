import 'dotenv/config'
console.log("Dotenv loaded")
import connectToDB from './src/config/database.js'
console.log("Database loaded")
import app from './src/app.js'
console.log("App loaded")
import { initSocket } from './src/sockets/server.socket.js'
console.log("Socket loaded")
