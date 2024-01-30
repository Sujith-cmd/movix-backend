import ChatModel from '../Model/ChatModel.js'
import MessageModel from '../Model/MessageModel.js'


export const addMessage = async(req,res)=>{
  const {chatId,senderId,text} =req.body
    const message = new MessageModel({
        chatId,senderId,text
    })
    
    try {
        const result = await message.save()
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
    try {
        const resp = await ChatModel.findOne({
           _id: chatId
        })
      const arr=resp.members
      const response = await ChatModel.updateOne(
        { members: arr },
        { $set: { members: arr } }
    );
    } catch (error) {
        console.log("some uperror");
        console.log(error);
    }
}

export const getMessages = async(req,res)=>{
    const {chatId} = req.params
    
    try {
        const result = await MessageModel.find({
            chatId
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
}
export const changeStatus = async(req,res)=>{
    const {chatId} = req.params
     console.log("chatis",chatId);
    try {
        const result = await MessageModel.updateMany(
            { chatId },
            { $set: { readStatus: "read" } }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
}