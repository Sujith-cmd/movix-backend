import Film from "../Model/Filmmodel.js"
import { errorHandler } from "../utils/error.js";
export const uploadFilm = async (req, res,next) => {
   const {username,director,poster,price} = req.body
   try {
    
       const newFilm= new Film({
        username,director,poster,price
       })
       const savedFilm=await newFilm.save()
       res.status(200).json(savedFilm)

   } catch (error) {
    console.log(error);
       next(errorHandler(500,"Something gone wrong"));
   }

  };

  export const getFilms = async (req, res,next) => {
   
    try {
     
        const films= await Film.find()
        res.status(200).json(films)
 
    } catch (error) {
     console.log(error);
        next(errorHandler(500,"didn't get the films list from db"));
    }
 
   };