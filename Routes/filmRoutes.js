import express from "express"
import {uploadFilm,getFilms } from "../Controllers/filmControllers.js"

const router=express.Router()

router.post("/signup",uploadFilm)
router.get("/filmsList",getFilms)


export default router