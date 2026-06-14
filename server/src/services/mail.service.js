import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter =  nodemailer.createTransport({
  service: 'gmail',
  auth:{
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    clientId: process.env.GOOGLE_CLIENT_ID,
  }
})

transporter.verify()
  .then(() => {
    console.log("email transporter is ready to send emails")
  })
  .catch((err) => {
    console.log("email transporter verification failed:", err)
  })

export const sendVerificationEmail = async ({to, subject, html, text})=>{
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text
  }

  const info = await transporter.sendMail(mailOptions)
  console.log("verification email sent:", info)
}