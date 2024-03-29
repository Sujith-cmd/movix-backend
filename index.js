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
import http from 'http'; 
import { Server } from 'socket.io'; 
dotenv.config()
const app=express()
const server = http.createServer(app);
// const io = new Server(server);
const io = new Server(server, {
    cors: {
        origin: ["https://movix-frontend-6gg1.vercel.app","https://movixin.jith.shop","http://localhost:5173"],
        credentials: true
    }
});

let activeUsers=[]
io.on("connection",(socket)=>{
    socket.on('new-user-add',(newUserId)=>{
        
        if(!activeUsers.some((user)=>user.userId === newUserId)){
            activeUsers.push({
                userId:newUserId,
                socketId:socket.id
            })
        }
        console.log("active users");
        console.log(activeUsers);
        io.emit('get-users',activeUsers)
    })


    socket.on("send-message",(data)=>{
       

            const {receiverId,senderId}=data
            const user= activeUsers.find((user)=>user.userId ===receiverId)
      
            if(user){
                io.to(user.socketId).emit("receive-message", data)
                
            }
           
        
    }
    )

    socket.on("disconnect",()=>{
        activeUsers= activeUsers.filter((user)=>user.socketId !==socket.id)
    
        io.emit('get-users',activeUsers)
    })
})

// mongoose.connect
const connect= async (req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("connected db");
    }catch(err){
        console.log(err.message);
    }
    }
app.use(cookieParser())
app.use(
    cors({
      origin: ["https://movix-frontend-6gg1.vercel.app","https://movixin.jith.shop","http://localhost:5173"],
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


server.listen(5000,()=>{
    try {
        connect()
    } catch (error) {
        console.log(" error ",error.message);
    }
    console.log("backend started");
})






































app.use(
    cors({
      origin: ["https://movix-frontend-6gg1.vercel.app","https://movixin.jith.shop","http://localhost:5173"],
      credentials: true, // Allow sending cookies with the request
    })
  );