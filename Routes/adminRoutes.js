import express from "express"
import {adminLogin, listing, signout ,utility,bookings,noCalling} from "../Controllers/adminController.js"
import { verifyToken } from "../utils/verifyUser.js"
const router=express.Router()

router.post("/login",adminLogin)
router.get("/list",verifyToken, listing)
router.get("/signout",signout)
router.get("/bookings/:pageNo",verifyToken,bookings)
router.get("/noCalling",verifyToken,noCalling)
// router.post("/utility",utility)
export default router