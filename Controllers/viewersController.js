import Bookings from "../Model/Bookings.js";
import User from '../Model/Usermodel.js';
import Vendor from '../Model/Vendormodel.js';
import bcrypt from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'
import stripe from 'stripe';
import crypto from 'crypto';
import nodemailer from 'nodemailer'
const stripeInstance = stripe('sk_test_51OFALpSB9eYCrjcG6KBzHYP0HYRw1pC5QH1u53yIAUkm6TkjstVL31Z7b1hkz86fc9yioq6DlKWJIH9ZJ8BtJiH800RnMnA1wJ');


// import dotenv from 'dotenv'
// dotenv.config()

  // var gateway = new braintree.BraintreeGateway({
  //   environment: braintree.Environment.Sandbox,
  //   merchantId: "r3xzbv8svh3qn43f",
  //   publicKey: "nwzkdk3w3w76cv8h",
  //   privateKey: "8354b0f0b95cd6846a12fb01d9827fc9"
  // });
  
  // You can proceed with using `gateway` for Braintree operations here


     export const signup = async (req,res,next)=>{
    const {username,email,password} =req.body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if(username==undefined||username==null||username.trim()==""||email==undefined||email==null||email.trim()==""||password==undefined||password==null||!emailRegex.test(email)){
      return res.status(500).json({msg:"Something went wrong"})
     }

    try {
      const viewer= await User.findOne({email})

      if(viewer){
        console.log("viewer already exists");
        console.log(viewer);
        return res.status(401).json({msg:"Email already exists"})
      }else{
      const salt= bcrypt.genSaltSync(10);
    const hash= bcrypt.hashSync(password,salt)
   

        const newUser= new User({
            username,email,password:hash
    })

        // console.log("NEW USER");
        // console.log(newUser);

    const savedUser=await newUser.save()
    
    console.log("saved USER");
    console.log(savedUser);
        
        res.status(200).json(savedUser)
  }
    } catch (error) {
       console.log("error");
       console.log(error);
       next(errorHandler(500,"Something gone wrong"));
        
    }
    
}

 
export const login = async (req,res,next)=>{
    // console.log(req.body);
const {email,password} =req.body
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (emailRegex.test(email)&&password!==""&&password!==undefined) {
    // Valid email
   

  try {
    const viewer= await User.findOne({email})
    // console.log(viewer);
   if(viewer){
   
    const isPasswordCorrect= await bcrypt.compare(password,viewer.password);
   
    if(isPasswordCorrect){
      if(viewer.isAccess){
        const token=jwt.sign({id:viewer._id},process.env.JWT_SECRET)
        const {password,...rest}=viewer._doc
        const expiryDate = new Date(Date.now()+3600000)
        // res.cookie('access_token',token,{httpOnly:true, expires:expiryDate}).status(200).json({rest,message:"login successful"})
        res.status(200).json({rest,token,message:"login successful"})
      }else{
        return res.status(401).json({msg:"Access blocked.Please contact admin"})
      }
       }else{
        // next(errorHandler(401,"Invalid Credentials"))
        return res.status(401).json({msg:"Password is incorrect"})
    } 
}else{
    // next(errorHandler(401,"Invalid Credentials"))
    return res.status(403).json({msg:"Invalid credential details"})
}
   
  } catch (error) {
    // res.status(401).json({message:"login denied"})
    // next(error)
    res.status(500).json({msg:"Something went wrong.Try again"})


   
  }
}else{
  return res.status(403).json({msg:"Invalid credential details"})
}
}
export const updateUserStatus = async (req, res, next) => {
  const store=req.body

  console.log(req.body.isAccess);
 
  try {
      const user = await User.findOne({_id:req.params.id})
    
  
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
         
          isAccess:req.body.isAccess,
        
            }
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    console.log("rest");
    console.log(rest);
  return  res.status(200).json(rest);
  } catch (error) {
    console.log("updationError");
    console.log(error);
  }
}
export const updateUser = async (req, res, next) => {
    // if (req.user.id !== req.params.id) {
    //   return next(errorHandler(401, 'You can update only your account!'));
    // }  console.log("req.body");
    const store=req.body

    // console.log(req.body.isAccess);
   
    try {
        const user = await User.findOne({_id:req.params.id})
      
    
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username:req.body.username || user.username,
           
            "address.locality": req.body.locality ||user.address.locality ,
            "address.district": req.body.district ||user.address.district ,
            "address.state": req.body.state ||user.address.state ,
            isAccess:req.body.isAccess||user.isAccess,
            displayPicture:req.body.thumbnailPic||user.displayPicture,
              }
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      // console.log("rest");
      // console.log(rest);
    return  res.status(200).json(rest);
    } catch (error) {
      console.log("updationError");
      console.log(error);
    }
  };

export const search = async (req,res)=>{
  const{isTheatre,search,location,seats}=req.body
  
    try {
        if(!isTheatre&&!search&&!location&&!seats){
            const vendors=await Vendor.find()

            return res.status(200).json(vendors)
        }
        // if(isTheatre==undefined){
        //   const isTheatre=true
        // }
        // if(!search){
        //   const search="00"
        // }
        // if(!location==undefined){
        //     const location="00"
        // }
        // if(!seats==undefined){
        //     const seats=1
        // }
        // console.log(isTheatre);
        // console.log(location);
        // console.log(search);
        // console.log(seats);
        // const vendors=await Vendor.find({"$or":[{"username":{$regex:search?search:"",$options:"i"}},{"address.district":{$regex:search?search:"",$options:"i"}}],seatingCapacity:{$gte:seats?seats:1},isTheatre:isTheatre?isTheatre:true})
        const vendors=await Vendor.find({$and:[{$or:[{"username":{$regex:search?search:"",$options:"i"}},{"address.district":{$regex:search?search:"",$options:"i"}}]},{"seatingCapacity":{$gte:seats?seats:1}},{"isTheatre":isTheatre?isTheatre:true},,{"address.district":location?location:"00"}]})
        
       
       return res.status(200).json({msg:"got it",vendors})
    } catch (error) {
        
        res.status(500).json({msg:"enter location and search"})
    }   

}

export const booking = async (req,res)=>{
  console.log("hello ");
  console.log(req.body);
  // req.body[bill]=req.bill;
  const vId=req.params.vid
  const uId=req.params.uid
  const bookingId=req.body.bookingId
  const slot=req.body.slots.map((time)=>{
    return Number(time)
  })
  // console.log(req.body);

  const date=req.body.date
//   console.log("uid");
  // console.log(uId);
//   console.log("vid");
  // console.log(vId);
  // const req.bill
try {
    console.log("req.bill");
    console.log(req.body.bill);
  const updateObject = {
    $push: {
      bookings: {...req.body,bill:req.body.bill},
      [`bookedSlots.${date}`]: { $each: slot }
      
    },
    $addToSet: {
      viewers: uId
    },
    $inc:{
      account_Bal:req.body.bill
    }
  };
  
  var updatedVendor = await Vendor.findByIdAndUpdate(
    vId,
    updateObject,
    { new: true }
  );
  const typ=updatedVendor.account_Bal
  // console.log("type offf");
  // console.log(typeof(typ));
// console.log("updatedVendor");
// console.log(updatedVendor);
  if(req.body.pay=="wallet"){

    var updatedUser = await User.findByIdAndUpdate(
      uId,
    {
      $push: {"bookings": req.body},$inc: { account_Bal:-req.body.bill} 
    },
    { new: true }
    );
  }else{
    var updatedUser = await User.findByIdAndUpdate(
      uId,
    {
      $push: {"bookings": req.body}
    },
    { new: true }
    );
  }

 
} catch (error) {
    console.log(error);
    return res.status(500).json(error)
  }
  

   
  
// Bookings
try {
    
  const newBooking= new Bookings({
    bookings:{...req.body},
    status:"booked",
    bookingId
})
var savedBooking=await newBooking.save()
} catch (error) {
  
  return res.status(500).json(error)
}

res.status(200).json({updatedUser,savedBooking,updatedVendor})
}


export const google = async (req,res)=>{
try {
    const viewer= await User.findOne({email:req.body.email})
    if(viewer){
        const token = jwt.sign({id:viewer._id},process.env.JWT_SECRET)
        const {password,...rest}=viewer._doc
        const expiryDate = new Date(Date.now()+3600000)
       return res.cookie('access_token',token,{httpOnly:true, expires:expiryDate}).status(200).json({rest,message:"login successful"})
       
    }else{
         const generatedPassword=Math.random().toString(36).slice(-8)
         const newUser= new User({
            username:req.body.username.split(" ").join("").toLowerCase(),
            email:req.body.email,password:generatedPassword,displayPicture:req.body.photoURL
    })
        await newUser.save()
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
        // const {password,...rest}=newUser
        const expiryDate = new Date(Date.now()+3600000)
      return  res.cookie('access_token',token,{httpOnly:true, expires:expiryDate}).status(200).json({newUser,message:"signup and login successful"})
       
        }
} catch (error) {
    console.log(error);
  return res.status(500).json({message:"login failed"})

}
}




  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can delete only your account!'));
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User has been deleted...');
    } catch (error) {
      next(error);
    }
  
  }

  export const cancelShow = async (req, res, next) => {
   const id=req.params.id
   const bill=req.body.bill
  
   const bookingId=req.body.id
   const dateOfBooking=req.body.bookingDate
  const theatreId=req.body.theatreId
  const bookedSlots=req.body.slots
  //  console.log("bill and date");
  //  console.log(bill);
  //  console.log(dateOfBooking);
    try {
      const userDetail=await User.findOne({_id:id})



      const vendorDetail=await Vendor.findOne({_id:theatreId})
      
      var vendorSlots=vendorDetail.bookedSlots
      const vendorBookings=vendorDetail.bookings
      var datedSlots=vendorSlots[dateOfBooking]
     
     
      

   
        const vendBookings=vendorBookings.map((book)=> {
         if(book.bookingId==bookingId){
          book.status="cancelled"
         }
            return book
          
          });
        const vend=datedSlots.filter((time)=> {
          const checked=bookedSlots.indexOf(time)
            return checked==-1
          
          });
          datedSlots=vend
      
      delete vendorSlots[dateOfBooking]
      vendorSlots[dateOfBooking]=datedSlots
      // console.log("vendorSlooots");
      // console.log(vendorSlots);

    const vendor= await Vendor.findByIdAndUpdate(theatreId,{ $set: { bookedSlots:vendorSlots,bookings:vendBookings}, $inc: {
      account_Bal: -bill
    } },{ new: true });




      const BookingsArray=userDetail?.bookings?.filter((book)=> {
        return book.bookingId!==bookingId;
      });
      // console.log(Bookings);
     const user1= await User.findByIdAndUpdate(id,{ $inc: { account_Bal:bill} },{ new: true });
     const user= await User.findByIdAndUpdate(id,{ $set: {
      bookings:BookingsArray
        }},{ new: true });
    // 
    //theatreId,bookingDate,slots
    const updatedBooking = await Bookings.findOneAndUpdate(
      { bookingId },
      { $set: { status: "cancelled" } }
    );
          res.status(200).json(user);
    } catch (error) {
      // next(error);
    console.log("errror in cancel");
    console.log(error);  
  }
  
  }

  export const userDet = async(req, res) => {
    const id=req.params.id
   console.log("idddd");
   console.log(id);
    try {
        const userDetails = await User.findById(id)
        res.status(200).json(userDetails)
        console.log("userDetails");
        console.log(userDetails);
}catch(err){
    res.status(403).json({mssg:"no matching id"})
}
  };
  export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json('Signout success!');
  };


  // braintreeTokenController

  // export const braintreeTokenController = async(req, res) => {
  //   try {
  //     gateway.clientToken.generate({}, function(err,response){
  //       if(err){
  //         res.status(500).send(err)
  //       }else{
  //          res.send(response)
  //       }
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };
  // // braintreePaymentController
  // export const braintreePaymentController = async (req, res) => {
  //   try {
  //    const {bill,nonce} = req.body
  //    let newTransaction = gateway.transaction.sale({
  //     amount:bill,
  //     paymentMethodNonce: nonce,
  //     options:{
  //       submitForSettlement:true
  //     }
  //    },
  //    function(error,result){
  //     if(result){
  //     // req.bill=result
  //     res.json({ok:true})
  //     }else{
  //        res.status(500).send(error)
  //     }
  //    }
  //    )
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  // checkout

  export const checkout = async (req, res) => {
   const product=req.body 
   console.log(product);
   
   // This is your test secret API key.
   const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ['card'], // Use 'payment_method_types' instead of 'payment_methods_types'
    line_items: [
      {
        price_data: {
          currency:"inr",
          product_data:{
            name:product.theatrename
          },
          unit_amount:Math.round((product.bill*100)/product.seatsNeeded)
        },
       quantity:product.seatsNeeded
      },
    ],
    mode: 'payment',
    success_url: `https://movixin.jith.shop/userProfile`,
    cancel_url: `https://movixin.jith.shop/checkoutFailure`,
  });
  console.log("session");
  console.log(session);

  res.json({id:session.id,total:session.amount_total});
  }

  const genarateOTP = async () => {
    try {
      const otps = Math.floor(1000 + Math.random() * 9000);
      console.log(otps);
      const otp = otps.toString();
      const secret = crypto.createHash("sha256").update(otp).digest("hex");
  
      return { otp, secret };
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const sendemailotp = async (email, otp) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'gadgetcartmailer@gmail.com',
          pass: 'sylmlabgttnqbhqh',
        },
        tls: {
          rejectUnauthorized: false
        }
      });
  
      const mailoptions = {
        from: "gadgetcartmailer@gmail.com",
        to: email,
        subject: "for verification mail",
        html: "<p>your otp is " + otp + "</p>",
      };
  
      transporter.sendMail(mailoptions, (error, data) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log("Email has been sent ", data.response);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  export const sendOTP = async (req, res) => {
    const email=req.body.userEmail
    
    const newUser = await User.findOne({ email });
    if (newUser) {
      console.log("newuser");
      console.log(newUser);
      const { otp, secret } = await genarateOTP();
      // res.cookie("id", newUser._id, { maxAge: 500000, httpOnly: true });
      // newUser.OTP = secret
      // newUser.save()
      await sendemailotp(email, otp);
      
      res.status(200).json(otp)
    } else {
      res.status(400).json({ message: 'email not exist' })
      console.log('no email');
    }
  }

  export const forgetPass = async (req, res) => {
    const pass=req.body.newPass
    const email=req.body.userEmail
    console.log("forgetttt");
    console.log(pass);
    console.log(email);
    var newUser = await User.findOne({ email });
    if (newUser) {
      // console.log(newUser);
      if(newUser){
        const id=newUser?.email
        console.log("id");
        console.log(id);
        const salt= bcrypt.genSaltSync(10);
        const hash= bcrypt.hashSync(pass,salt)
        const newU = await User.updateOne({email:id  },{
          password:hash
        },{new:true});
        res.status(200).json(newU)
      }
     
      
    } else {
      res.status(400).json({ message: 'email not exist' })
      console.log('no email');
    }
  }

  