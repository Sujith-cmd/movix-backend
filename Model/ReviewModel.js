import mongoose from "mongoose"


const ReviewSchema= mongoose.Schema({
    theatreId : {
        type:String,
        ref:'Vendordb'
    },
    userId:{
        type: String,
        ref:'Viewer'
    },
    text:{
        type:String
    }
},
{timestamps: true});
 
export default mongoose.model("Review", ReviewSchema)