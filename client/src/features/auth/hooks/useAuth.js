import {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {login, register, getMe} from '../services/auth.api'
import {setUser, setLoading, setError} from '../auth.slice'

export const useAuth = ()=>{
  const dispatch = useDispatch()

  const handleRegister = useCallback(async ({username, email, password})=>{
    try{
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await register({username, email, password})
      return data
    }catch(err){
      dispatch(setError(err.response?.data?.message || "registered failed"))
      throw err
    }finally{
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const handleLogin = useCallback(async ({email, password})=>{
    try{
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await login({email, password})
      dispatch(setUser(data.user))
      return data
    }catch(err){
      dispatch(setError(err.response?.data?.message || "login failed"))
      throw err
    }finally{
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const handleGetMe = useCallback(async ()=>{
    try{
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await getMe()
      dispatch(setUser(data.user))
    }catch(err){
      dispatch(setUser(null))

      // A missing session on first load is normal, so don't surface it as a renderable error.
      if (err.response?.status === 401) {
        dispatch(setError(null))
        return
      }

      dispatch(setError(err.response?.data?.message || "failed to fetch user"))
    }finally{
      dispatch(setLoading(false))
    }
  }, [dispatch])

  return{
    handleRegister,
    handleLogin,
    handleGetMe
  }
}
