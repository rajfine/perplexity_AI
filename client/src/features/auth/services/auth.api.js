import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // cooikies  access karne ke liye
})

export const register = async({username, email, password})=>{
  const response = await api.post('/api/auth/register', {username, email, password})
  return response.data
}

export const login = async({email, password})=>{
  const response = await api.post('/api/auth/login', {email, password})
  return response.data
}

export const getMe = async ()=>{
  const response = await api.get('/api/auth/getme')
  return response.data
}
