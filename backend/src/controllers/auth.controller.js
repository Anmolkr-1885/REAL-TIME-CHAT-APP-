import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import  User  from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if(!email || !fullName || !password) {
      return res.status(400).json({message: "All fields are required"});
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be longer than 6" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        message: "Error in creating user",
      });
    }
  } catch (err) {
    console.log("Error in signup controller", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async(req, res) => {
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ email });
    if(!user){
      return res.status(400).json({message: "User does not exist"});
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
      return res.status(400).json({message: "Invalid credentials"});
    }   
    generateToken(user,res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
    
  }catch(err){
    console.log("Error in login controller", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }




};

export const logout = (req, res) => {
  try{
    res.cookie("jwt", "", { 
      maxAge: 0,
       });
    res.status(200).json({message: "Logged out successfully"});
  }catch(err){
    console.log("Error in logout controller", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }

};


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;   // ✅ destructure karo
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // ✅ ab string jaayegi, object nahi
    const uploadedResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pics",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedResponse.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Error in updating profile picture" });
    }

    res.status(200).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      profilePic: updatedUser.profilePic,
    });
  } catch (err) {
    console.log("Error in updateProfile controller", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const checkAuth = async(req,res) => {
  try{
    const user = req.user;
    if(!user){
      return res.status(401).json({message: "Not authorized"});
    }
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });

  }catch(err){
    console.log("Error in checkAuth controller", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}   

