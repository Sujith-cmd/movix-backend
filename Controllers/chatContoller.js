import ChatModel from '../Model/ChatModel.js'

export const createChat = async(req,res)=>{
    // console.log("createchat");
    // console.log(req.body);
    const newChat = new ChatModel({
        members:[req.body.senderId,req.body.receiverId]
    })
    // console.log(newChat);
    try {
        const result = await newChat.save()
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
}

export const userChats = async(req,res)=>{
   
    try {
        const chat= await ChatModel.find({
            members:{$in: [req.params.userId]}
        }).sort({ updatedAt: -1 })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}
export const findChat = async(req,res)=>{
   
    try {
        const chat= await ChatModel.find({
            members:{$all: [req.params.firstId, req.params.secondId]}
        })
        if(chat){
           console.log("findChat");
           console.log(chat);
            res.status(200).json(chat)
        }else{
            res.status(200).json({msg:"no chats"})

        }
    } catch (error) {
        res.status(500).json(error)
    }
}
export const updateChatId = async(req,res)=>{
        const mo=req.params.membero
        const mt=req.params.membert
        console.log("chatId");
        // console.log(chatId);
        try {
            const resp = await ChatModel.updateOne(
                { members: { $all: [mo, mt] } },
                { $set: { members: [mo, mt] } }
            );
            res.status(200).json(resp);
        } catch (error) {
            res.status(500).json(error);
        }
        
}