import {createSlice} from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats:{},
    currentChatId: null,
    isLoading: false,
    error:null
  },
  reducers:{
    createNewChat:(state, action)=>{
      const {chatId, title, } = action.payload
      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      }
    },
    addNewMessage:(state, action)=>{
      const {chatId, content, role} = action.payload
      state.chats[chatId].messages.push({content, role})
    },
    replaceChatId:(state, action)=>{
      const {oldChatId, newChatId, title} = action.payload
      if(state.chats[oldChatId]){
        state.chats[newChatId] = {
          ...state.chats[oldChatId],
          id: newChatId,
          title,
          lastUpdated: new Date().toISOString(),
        }
        delete state.chats[oldChatId]
      }
      if(state.currentChatId === oldChatId){
        state.currentChatId = newChatId
      }
    },
    removeChat:(state, action)=>{
      const chatId = action.payload
      delete state.chats[chatId]

      if(state.currentChatId === chatId){
        state.currentChatId = null
      }
    },
    setChatMessages:(state, action)=>{
      const {chatId, messages} = action.payload
      if(state.chats[chatId]){
        state.chats[chatId].messages = messages
      }
    },
    setChats: (state, action)=>{
      state.chats = action.payload
    },
    setCurrentChatId: (state, action)=>{
      state.currentChatId = action.payload
    },
    setLoading: (state, action)=>{
      state.isLoading = action.payload
    },
    setError: (state, action)=>{
      state.error = action.payload
    }
  }
})

export const {setChats, setChatMessages, setCurrentChatId, setLoading, setError, createNewChat, replaceChatId, removeChat, addNewMessage} = chatSlice.actions
export default chatSlice.reducer
