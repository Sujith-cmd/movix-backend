import mongoose from "mongoose"

const filmSchema= mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    director: {
        type:String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    filmFile: {
        type: String,
        default:""
    },
    price: {
        type: Number,
        required:true
    },
    telecastedTheatres: [
        {type:String,dafault:null}  
    ]

},{timestamps:true})

export default mongoose.model("Film",filmSchema)