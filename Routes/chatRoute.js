import express from 'express'
import { verifyToken } from '../utils/verify.js'
import { createChat, findChat, userChats,updateChatId } from '../Controllers/chatContoller.js'
const router = express.Router()

router.post("/",verifyToken,createChat)
router.get("/:userId",verifyToken,userChats)
router.get("/find/:firstId/:secondId",findChat)
router.post("/change/change/:membero/:membert",verifyToken,updateChatId)

export default router