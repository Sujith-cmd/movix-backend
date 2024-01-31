import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import userRoutes from "./Routes/userRoutes.js"
import vendorRoutes from "./Routes/vendorRoutes.js"
import adminRoutes from "./Routes/adminRoutes.js"
import chatRoutes from "./Routes/chatRoute.js"
import filmRoutes from "./Routes/filmRoutes.js"
import messageRoute from './Routes/messageRoute.js'
import reviewRoute from './Routes/reviewRoutes.js'
import cors from 'cors'
dotenv.config()
const app=express()
mongoose.connect
const connect= async (req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO)
        // console.log("connected db");
    }catch(err){
        // console.log("gcfthh");
        console.log(err);
        
    }
    }
app.use(cookieParser())
app.use(
    cors({
      origin: ["https://movix-frontend-6gg1.vercel.app","http://localhost:5173"],
      credentials: true, // Allow sending cookies with the request
    })
  );
app.use(express.json())
app.use("/api/users",userRoutes)
app.use("/api/vendors",vendorRoutes)
app.use("/api/films",filmRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoute)
app.use("/api/review",reviewRoute)
app.use((err,req,res,next)=>{
    const statuscode= err.statuscode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statuscode).json({
        success:false,
        message,
        statuscode
    })

})

connect()

app.listen(5000,()=>{
    try {
        
        console.log("backend started");
    } catch (error) {
        console.log(" error ",error.message);
    }
   
})