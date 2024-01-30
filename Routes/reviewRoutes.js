import express from "express"
import { addRating, createReview } from "../Controllers/reviewController.js"
import { getReview } from "../Controllers/reviewController.js"
import { verifyToken } from "../utils/verifyUser.js"
const router = express.Router()

router.post("/createReview/:theatreId/:userId",verifyToken,createReview)
router.get("/getReview/:theatreId",verifyToken,getReview)
router.post("/rating/:userId/:theatreId",verifyToken,addRating)

export default router