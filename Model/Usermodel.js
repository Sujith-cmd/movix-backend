import mongoose from "mongoose"

const userSchema= mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
   
    account_Bal: {
        type: Number,
        default: 0
    },
    Role: {
        type: Number,
        default:0
    },
    isAccess: {
        type : Boolean,
        default: true
    },
    displayPicture : {
        type : String,
        default:""
    },
    address: {
        locality:{type: String,default:""},
        district:{type:String,default:""},
        state:{type:String,default:""}
    
    },
    bookings : [{
        type:Object
    }]
},{timestamps:true})

export default mongoose.model("Viewer",userSchema)