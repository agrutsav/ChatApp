const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const userRoutes=require("./routes/userRoutes")
const messageRoute=require("./routes/messagesRoute")
const socket=require("socket.io")


const app=express();
app.use(cors());
require("dotenv").config();

app.use(express.json());


mongoose.connect(process.env.MONGO_URL,{
}).then(()=>{
    console.log("connection successful")
}).catch((err)=>{
    console.log(err.message);
})

app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoute)


const server=app.listen(process.env.PORT,()=>{
    console.log(`Server Started on ${process.env.PORT}`)
})

const io=socket(server,{
    cors:{
        origin:"https://chat-app-z4p5.vercel.app",
        credentials:true,
    }
})

global.onlineUsers=new Map();
io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    })
    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message)
        }
    })
})