import express from "express"
import { booking, login,userDet, search, signup ,google, updateUser, deleteUser,signout,checkout,sendOTP,cancelShow,forgetPass, updateUserStatus} from "../Controllers/viewersController.js"
import { verifyToken } from "../utils/verifyUser.js"

const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/booking/:vid/:uid",verifyToken,booking)
router.post("/update/:id",verifyToken,updateUser)
router.post("/updateStatus/:id",verifyToken,updateUserStatus)
router.post("/cancel/:id",verifyToken,cancelShow)
router.post("/checkout-session",verifyToken,checkout)
router.delete("/delete/:id",verifyToken,deleteUser)

router.post("/sendOTP",sendOTP)
router.post("/forgetPass",forgetPass)
router.get("/signout",signout)
router.get("/search",search)
router.get("/:id",userDet)
router.post('/google',google)
// router.post("/booking/:uid/:tid",booking)
// router.post("/availableSlots/:vid/:date",booking)
// router.get("/braintree/token",braintreeTokenController)
// router.post("/braintree/token",braintreePaymentController)

export default router