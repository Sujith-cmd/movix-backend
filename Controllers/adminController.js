import Admin from "../Model/AdminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usermodel from "../Model/Usermodel.js";
import Vendormodel from "../Model/Vendormodel.js";
import { errorHandler } from "../utils/error.js";
import Bookings from "../Model/Bookings.js";

export const adminLogin = async (req, res) => {
  const { adminEmail, adminPassword } = req.body;

  // res.send("asghvadghvh");
  try {
    const admin = await Admin.findOne({ adminEmail });
    if (admin) {
      if (adminPassword == admin.adminPassword) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
        const expiryDate = new Date(Date.now() + 3600000);
        return res.status(200)
          .json({ admin, message: "vendor login successful" ,token});
      } else {
        return res.status(401).json({msg:"wrong credentials"});
      }
    } else {
      return res.status(403).json({msg:"you are not an authorized admin"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export const listing = async (req, res) => {
  try {
    const viewers = await Usermodel.find();
    const vendors = await Vendormodel.find();

    res.status(200).json({ viewers, vendors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params._id;
  const { username, email } = req.body;

  try {
    const viewers = await Usermodel.findByIdAndUpdate(
      { id },
      { $set: { username, email } }
    );

    res.status(200).json({ message: "user updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateVendor = async (req, res) => {
  const id = req.params._id;
  const { username, email } = req.body;

  try {
    const viewers = await Vendormodel.findByIdAndUpdate(
      { id },
      { $set: { username, email } }
    );

    res.status(200).json({ message: "VENDOR updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const blockingUser = async (req, res) => {
  const id = req.params._id;

  try {
    const viewer = await Usermodel.findOne({ _id: id });

    const blockViewer = await Usermodel.findByIdAndUpdate(
      { id },
      { $set: { isAccess: !viewer.isAccess } }
    );

    res.status(200).json({ message: "user blocked" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const blockingVendor = async (req, res) => {
  const id = req.params._id;

  try {
    const viewer = await Vendormodel.findOne({ _id: id });

    const blockViewer = await Vendormodel.findByIdAndUpdate(
      { id },
      { $set: { isAccess: !viewer.isAccess } }
    );

    res.status(200).json({ message: "vendor blocked" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success!");
};


export const utility = async (req, res) => {
  try {
    const updatedVendors = await Vendormodel.updateMany(
      {}, // Empty filter object {} means update all documents
      { $set: { otp: "jooiii" } }, // Update operation using $set to set otp to "jooiii"
      { upsert: true } // Adding the upsert option to create documents if they don't exist
    );

    console.log("goodd");
    res.status(200).json(updatedVendors);
  } catch (error) {
    res.status(500).json(error);
  }
};


 // const updatedUser = await Usermodel.Update(
    //   {},
    //     {
    //       $set: {
    //         bookings:{}  }}
    //     ,{ new: true }
    //   )
export const bookings =async (req, res) => {
  const pageNo=req.params.pageNo
  const upto=pageNo+3
  try {
    const books = await Bookings.find({ status:"cancelled"}).skip(pageNo).limit(upto);
    const booksLength=books.length
  

      res.status(200).json({ books,booksLength });
   
   
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const noCalling =async (req, res) => {
  
  try {
    const tNo = await Vendormodel.find({isTheatre:true}).count();
    const gNo = await Vendormodel.find({isTheatre:false}).count();
    const userNo=await Usermodel.find().count()
    const bookNo=await Bookings.find().count()
   
    res.status(200).json({ tNo,gNo,userNo,bookNo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

