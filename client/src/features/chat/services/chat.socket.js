import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
let socket;

export const initializeSocketConnection = ()=>{
  if (socket?.connected) {
    return socket
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      console.log('connected to socket.io server')
    })

    socket.on('connect_error', (err) => {
      console.log('socket connection error:', err.message)
    })
  }

  return socket
}

export const disconnectSocket = ()=>{
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
