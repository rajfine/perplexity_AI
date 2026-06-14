import  userModel from '../models/user.model.js';
import { sendVerificationEmail } from '../services/mail.service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => { 

  const { username, password } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  const isUserAlreadyExist = await userModel.findOne({
    $or: [
      { email },
      { username }
    ]
  })
  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: 'User already exists',
      sucess: false,
      err: "user with this email or username already exists"
    })
  }

  const user = await userModel.create({
    username,
    email,
    password
  })
  const emailVerificationToken = jwt.sign({
    email: user.email,
  }, process.env.JWT_SECRET, { expiresIn: '1d' })

  await sendVerificationEmail({
    to: user.email,
    subject: 'welcome to perplexityAi, please verify your email',
    text: `Hi ${user.username},\n\nThank you for registering at perplexityAi! Please verify your email address by clicking the link below:\n\nhttp://localhost:3000/verify-email?email=${user.email}\n\nBest regards,\nThe perplexityAi Team`,
    html: `
      <p>Hi ${user.username},</p>
      <p>Thank you for registering at perplexityAi! Please verify your email address by clicking the link below:</p>
      <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
      <p>Best regards,<br>The perplexityAi Team</p>
    `
  })

  return res.status(201).json({
    message: 'User registered successfully',
    user: { 
      username: user.username,
      email: user.email, 
      verified: user.verified 
    }
  })
}

export const login = async (req,res)=>{
  const password = req.body.password
  const email = req.body.email?.trim().toLowerCase()

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
      success: false,
    })
  }

  const user = await userModel.findOne({email}).select('+password')
  if(!user){
    return res.status(404).json({
      message: 'User not found',
      success: false,
      error: 'No user found with this email'
    })
  }

  let isPasswordMatch = false

  try {
    isPasswordMatch = await bcrypt.compare(password, user.password)
  } catch (error) {
    isPasswordMatch = false
  }

  // Support legacy accounts that may have been stored without hashing.
  if (!isPasswordMatch && user.password === password) {
    isPasswordMatch = true
    user.password = password
    await user.save()
  }

  if (!isPasswordMatch) {
    return res.status(401).json({
      message: 'Invalid credentials',
      success: false,
      error: 'Incorrect password'
    })
  }

  if(!user.verified) {
    return res.status(403).json({
      message: 'Email not verified',
      success: false,
      error: 'Please verify your email before logging in'
    })
  }

  const token = jwt.sign({
    id: user._id,
  }, process.env.JWT_SECRET, { expiresIn: '1d' })
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  })

  res.status(200).json({
    message: 'Login successful',
    success: true,
    user: {
      username: user.username,
      email: user.email,
    }
  })
}

export const verifyEmail = async (req, res)=>{
  const { token } = req.query

  if(!token) {
    return res.status(400).json({
      message: 'Verification token is missing',
      success: false,
      error: 'Token is required for email verification'
    })
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid verification token',
      success: false,
      error: 'Token is invalid or expired'
    })
  }
  
  const user = await userModel.findOne({ email: decoded.email })
  if (!user) {
    return res.status(404).json({
      message: 'User not found',
      success: false,
      error: 'Invalid verification token'
    })
  }

  user.verified = true
  await user.save()

  // return res.status(200).json({
  //   message: 'Email verified successfully',
  //   success: true
  // })

  const html =`
    <h1>Email Verified Successfully</h1>
    <p>Thank you for verifying your email. You can now log in to your account.</p>
    <a href="/login">go to login</a>
  `
  return res.status(200).send(html)
}


export const getMe = async (req, res) => {
  const userId = req.user.id

  const user = await userModel.findById(userId)

  if(!user){
    return res.status(400).json({
      message: "user not found",
      success: false,
      err: "user not found"
    })
  }

  res.status(200).json({
    message: "user details fetched successfully",
    success: true,
    user
  })
}
