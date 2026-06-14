import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // cooikies  access karne ke liye
})

export const sendMessage = async ({message, chatId})=>{
  const response = await api.post('/api/chat/sendmessage', {message, chat: chatId})
  return response.data
}

export const getChats = async ()=>{
  const response = await api.get('/api/chat/getchats')
  return response.data
}

export const getMessages = async(chatId)=>{
  const response = await api.get(`/api/chat/getmessages/${chatId}`)
  return response.data
}

export const deleteChat = async(chatId)=>{
  await api.delete(`/api/chat/deletechat/${chatId}`)
}
