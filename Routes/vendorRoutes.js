import express from "express"
import { vendorSignin,allowEdit, prodDet, trendingList,forgetPass, vendorApproval,sendOTP, vendorDetails, vendorEatables, vendorEdit, vendorFacilities, vendorList, vendorRegistration, vendorSignup, vendorTimings,signout,delEat ,testing,vendorListing,subscribe, putNotAllowed,delFac} from "../Controllers/vendorController.js"
import { verifyToken } from "../utils/verifyUser.js"


const router=express.Router()

router.post("/signup",vendorSignup)
router.post("/signin",vendorSignin)
router.get("/vendorList",vendorList)
router.get("/trending/:type",trendingList)
router.get("/signout",signout)
router.post("/update/:id",verifyToken,allowEdit)
router.patch("/facilities/:id",verifyToken,vendorFacilities)
router.get("/facilities/:id",vendorDetails)
router.patch("/eatables/:id",verifyToken,vendorEatables)
router.post("/testing/:id",verifyToken,vendorTimings)
router.get("/explore/:type",vendorListing)
router.post("/subscribe",subscribe)
router.post("/putAllow",putNotAllowed)
router.delete("/deleteFacility",verifyToken,delFac)
router.delete("/deleteEatings",verifyToken,delEat)
router.get("/getDetails/:id",prodDet)
router.post("/sendOTP",sendOTP)
router.post("/forgetPass",forgetPass)

// router.get("/registration/:id",vendorRegistration)
router.put("/registration/:id",vendorRegistration)
router.put("/timings/:id",vendorTimings)
router.put("/approval/:id",vendorApproval)



export default router