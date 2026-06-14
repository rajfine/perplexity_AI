import {Router} from 'express'
import { identifyUser } from '../middlewares/auth.middleware.js'
import { deleteChat, getChat, getMessages, sendMessage } from '../controllers/chat.controller.js'

const chatRouter = Router()

chatRouter.post("/sendmessage",identifyUser, sendMessage)

chatRouter.get("/getchats",identifyUser, getChat)

chatRouter.get("/getmessages/:chatId", identifyUser, getMessages)

chatRouter.delete("/deletechat/:chatId", identifyUser, deleteChat)

export default chatRouter