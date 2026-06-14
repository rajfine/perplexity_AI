import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'


const Protected = ({children}) => {
  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)
  if(loading==true){
    return(<h1>loading</h1>)
  } 
  if(!user){
    return <Navigate to={"/login"} />
  }

  return children
}

export default Protected