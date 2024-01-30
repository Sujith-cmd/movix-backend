import mongoose from "mongoose"

const vendorSchema= mongoose.Schema({
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
    thumbnailPic:{
        type: String,
        default:""},
    featured: {
        type: Boolean,
        default: false
    },
    subscription: {
        type: Date,
        default: new Date()
    },
    features: [{
        featureName:{type:String,default:null},
        featureDescription:{type:String,default:null},
        featureFile:{type:String,default:null},
    }],
    isAccess: {
        type : String,
        default: "Not allowed"
    },
    displayPicture : {
        type : String,
        default:""
    },
    address: {type:Object,default:{
    houseNo: null,
    addresslineOne:null,
    addresslineTwo:null,
    postOffice:null,
    district:null,
    state:null,
    remark:null}
        
    
    },
    timeSlots: [{type:Number,default:[]}],

    isTheatre: {
        type:Boolean,
        required:true,
        default:true

    },
    seatingCapacity:{
        type:Number,
        default:1
    },
    Role: {
        type: Number,
        default:1
    },
    bookedSlots:{
        type:Object,default:{}
    },
    viewers: [{type:String,default:null}],
    eatables : [{
        item:{type:String,default:null},
        description:{type:String,default:null},
        image:{type:String,default:null},
        quantity:{type:String,default:null},
        price:{type:Number,default:null}
    }],
    price:{type:Number,default:1},
    rating:{
        type:Object,default:{}
    },
    noOfRatings:{type:Number,default:0},
    bookings : [{
        type:Object
    }],
    reviews:{type:Object,default:{}   },
    account_Bal:{type:Number,default:0}

},{timestamps:true})

export default mongoose.model("Vendordb",vendorSchema)



// date:{type:String,default:null},
//         slots:{type:Array,default:[]},
//         username:{type:String,default:null},
//         foodItems:{type:Array,default:[{item:{type:String},quantity:{type:Number},price:{type:Number},total_cost:{type:Number}}]},
//         foodprice:{type:Number,default:null},
//         people:{type:Number,default:null},
//         costPerHour:{type:Number,default:null},
//         totalRent:{type:Number,default:null},
//         totalAmount:{type:Number,default:null}