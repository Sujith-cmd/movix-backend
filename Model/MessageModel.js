import mongoose from "mongoose"


const MessageSchema= mongoose.Schema({
    chatId : {
        type:String
    },
    senderId:{
        type: String
    },
    text:{
        type:String
    },
    readStatus:{
        type:String,
        default:"not read"
    }
},
{timestamps: true});
 
export default mongoose.model("Message", MessageSchema)