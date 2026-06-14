import { generateChatTitle, generateResponse } from "../services/ai.service.js"
import chatModel from '../models/chat.model.js'
import messageModel from '../models/message.model.js'

export const sendMessage = async (req, res)=>{
  const {message, chat: chatId} = req.body
  
  let title = null
  let chat = null

  if(!chatId){
    title = await generateChatTitle(message)
    chat = await chatModel.create({
      user: req.user.id,
      title: title,
    })
  }

  const activeChatId = chatId || chat._id

  const userMessage = await messageModel.create({
    chat: activeChatId,
    content: message,
    role:"user"
  })
  
  const messages = await messageModel.find({ chat: activeChatId }) //.sort({ createdAt: 1 })
  
  const result = await generateResponse(messages)

  const aiMessage = await messageModel.create({
    chat: activeChatId,
    content: result,
    role:"ai"
  })

  return res.json({
    chat,
    title,
    userMessage,
    aiMessage
  })
}

export const getChat = async (req, res)=>{
  const userId = req.user.id

  console.log(userId)
  const chats = await chatModel.find({user: userId})

  return res.status(200).json({
    chats
  })
}

export const getMessages = async (req,res)=>{
  const {chatId} = req.params

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id
  })

  if(!chat){
    return res.status(404).json({
      message: "chat not found"
    })
  }

  const messages = await messageModel.find({
    chat: chatId
  })

  return res.status(200).json({
    message:"message recivied successfully",
    messages
  })

}

export const deleteChat = async (req,res)=>{
  const {chatId} = req.params
  const userId = req.user.id

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: userId
  })

  await messageModel.deleteMany({
    chat:chatId
  })

  if(!chat){
    return res.status(404).json({
      message: "chat not found"
    })
  }
  
  return res.status(200).json({
    message:"chat deleted successfully"
  })
}