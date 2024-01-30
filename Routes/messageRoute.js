import express from 'express'
import { addMessage, getMessages,changeStatus } from '../Controllers/messageController.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = express.Router()

router.post("/",verifyToken,addMessage)
router.get("/:chatId",verifyToken,getMessages)
router.post("/changeMsgStatus/:chatId",changeStatus)
// router.get("/find/:firstId/:secondId",findChat)

export default router