import mongoose from "mongoose"

const bookingSchema= mongoose.Schema({
    
    date:{type:Date,
    },
    bookings : {
        type:Object,
        default:{}
    },
    status:{
        type:String,
        

    },
    bookingId: {
        type:String,
    },
    
},{timestamps:true})

export default mongoose.model("Booking",bookingSchema)