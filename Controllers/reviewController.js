import Review from "../Model/ReviewModel.js"
import Vendormodel from "../Model/Vendormodel.js"

export const createReview = async(req,res)=>{
    // console.log("createchat");
    const theatreId=req.params.theatreId
    const userId=req.params.userId
    // console.log(req.body);
    const newReview = new Review({
        theatreId : theatreId,
        userId,
        text:req.body.text
    })
    console.log(newReview);
    try {
        const result = await newReview.save()
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
}


export const getReview = async(req,res)=>{
    // console.log("createchat");
    const theatreId=req.params.theatreId
    // const userId=req.params.userId
    // console.log(req.body);
   
    try {
        const result = await Review.find({theatreId}).populate('theatreId').populate('userId');
        // console.log(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
}


export const addRating = async (req, res) => {
    const theatreId = req.params.theatreId;
    const userId = req.params.userId;
    const rating = req.body.rating;

    try {
        let theatreRatings = {};

        const vendor = await Vendormodel.findById(theatreId);
        if (vendor.rating !== undefined) {
            theatreRatings = vendor.rating;
            theatreRatings[userId] = rating;
        } else {
            theatreRatings[userId] = rating;
        }
        let sum=0
        let count=0
        let avg=0
        Object.keys(theatreRatings).forEach(key => {
            const value = theatreRatings[key];
            sum+=value
            count++
        });
        avg=sum/count
        const updatedRating = await Vendormodel.findByIdAndUpdate(theatreId, { rating: theatreRatings,noOfRatings:avg }, { new: true });
        res.status(200).json(updatedRating);
    } catch (error) {
        res.status(500).json(error);
    }
};
