import { Router } from 'express';
import { getMe, login, register, verifyEmail } from '../controllers/auth.controller.js';
import { identifyUser } from '../middlewares/auth.middleware.js';

const authRouter = Router()


authRouter.post('/register', register)

authRouter.get('/verify-email', verifyEmail)

authRouter.post('/login', login)

authRouter.get('/getme', identifyUser, getMe)


export default authRouter