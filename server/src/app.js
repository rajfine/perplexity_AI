import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import morgan from 'morgan'
import cors from 'cors'
import chatRouter from './routes/chat.routes.js'
import path from 'path'
import { fileURLToPath } from "url";

const app = express()
app.set("trust proxy", 1)
app.use(express.static('./dist'))
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`Not allowed by CORS: ${origin}`))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use("/api/auth", authRouter)

app.use("/api/chat", chatRouter)

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

export default app
