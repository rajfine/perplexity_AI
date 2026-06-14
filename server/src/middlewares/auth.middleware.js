import jwt from 'jsonwebtoken'

export const identifyUser = (req, res, next) => {
  const token = req.cookies.token
  if(!token) {
    return res.status(401).json({
      message: 'Unauthorized, first register/login to get access',
      success: false,
      error: 'No token provided'
    })
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  }catch(err){
    return res.status(401).json({
      message: 'Unauthorized, invalid token',
      success: false,
      error: 'invalid token'
    })
  }
}