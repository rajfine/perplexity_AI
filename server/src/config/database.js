import mongoose, { connect } from 'mongoose'


const connectToDB = async ()=>{
  const conn = await mongoose.connect(process.env.MONGO_URI)
    // .then(()=>{
      // console.log("connected to DB")
      console.log(`MongoDB connected`) // ${conn.connection.host}`
      
    // })
  
}

export default connectToDB