import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import { disconnectSocket, initializeSocketConnection } from "../services/chat.socket";
import { addNewMessage, createNewChat, removeChat, replaceChatId, setChatMessages, setChats, setCurrentChatId, setError, setLoading } from "../chat.slice";
import { deleteChat as deleteChatRequest, getChats, getMessages, sendMessage } from "../services/chat.api";

export const useChat = ()=>{
  const dispatch =  useDispatch()
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const error = useSelector((state) => state.chat.error)
  const currentMessages = currentChatId ? chats[currentChatId]?.messages || [] : []

  const handleSendMessage = useCallback(async ({message, chatId, displayMessage})=>{
    const activeChatId = chatId || `temp-${Date.now()}`
    const userMessageContent = displayMessage || message

    try{
      dispatch(setLoading(true))
      dispatch(setError(null))

      if(!chatId){
        dispatch(createNewChat({
          chatId: activeChatId,
          title: userMessageContent.slice(0, 40)
        }))
        dispatch(setCurrentChatId(activeChatId))
      }

      dispatch(addNewMessage({
        chatId: activeChatId,
        content: userMessageContent,
        role: "user"
      }))

      const data = await sendMessage({message, chatId})
      const {chat, aiMessage} = data
      const savedChatId = chat?._id || activeChatId

      if(!savedChatId){
        throw new Error("chat id not found")
      }

      if(chat && chat._id !== activeChatId){
        dispatch(replaceChatId({
          oldChatId: activeChatId,
          newChatId: chat._id,
          title: chat.title,
        }))
      }

      dispatch(addNewMessage({
        chatId: savedChatId,
        content: aiMessage.content,
        role: aiMessage.role,
      }))
      dispatch(setCurrentChatId(savedChatId))
    }catch(err){
      dispatch(setError(err.response?.data?.message || "failed to send message"))
      throw err
    }finally{
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const handleGetChats = useCallback(async ()=>{
    try{
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await getChats()
      const chatsById = data.chats.reduce((acc, chat)=>{
        acc[chat._id] = {
          id: chat._id,
          title: chat.title,
          messages: [],
          lastUpdated: chat.updatedAt,
        }
        return acc
      }, {})

      dispatch(setChats(chatsById))
    }catch(err){
      dispatch(setError(err.response?.data?.message || "failed to fetch chats"))
    }finally{
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const handleNewChat = useCallback(()=>{
    dispatch(setCurrentChatId(null))
  }, [dispatch])

  const handleSelectChat = useCallback(async (chatId)=>{
    if(!chatId){
      return
    }

    dispatch(setCurrentChatId(chatId))

    if(chats[chatId]?.messages?.length){
      return
    }

    try{
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await getMessages(chatId)
      dispatch(setChatMessages({
        chatId,
        messages: data.messages,
      }))
    }catch(err){
      dispatch(setError(err.response?.data?.message || "failed to fetch messages"))
    }finally{
      dispatch(setLoading(false))
    }
  }, [chats, dispatch])

  const handleDeleteChat = useCallback(async (chatId)=>{
    if(!chatId){
      return
    }

    try{
      dispatch(setLoading(true))
      dispatch(setError(null))
      await deleteChatRequest(chatId)
      dispatch(removeChat(chatId))
    }catch(err){
      dispatch(setError(err.response?.data?.message || "failed to delete chat"))
      throw err
    }finally{
      dispatch(setLoading(false))
    }
  }, [dispatch])


  return {
    initializeSocketConnection ,
    disconnectSocket,
    chats,
    currentChatId,
    currentMessages,
    isLoading,
    error,
    handleGetChats,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleSendMessage,
    hanldeSendMesssage: handleSendMessage
  }
}
