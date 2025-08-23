import Message from "../models/message.models.js";
import User from "../models/user.model.js";
import { getReceiverSocketId } from "../lib/socket.js";
import {v2 as cloudinary} from "cloudinary";
import { io } from "../lib/socket.js";


export const getUserForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
       
        res.status(200).json(filteredUsers);




    }catch(err){
        console.log("Error in getUserForSidebar controller", err);
        res.status(500).json({message: "Internal server error"});
    }
}


export const getMessages = async (req, res) => {
    try{
     const { id: userToChatWith } = req.params;
     const myID = req.user._id;

     const messages = await Message.find({
        $or: [
          { senderId: myID, receiverId: userToChatWith },
          { senderId: userToChatWith, receiverId: myID },
        ],})
   
          res.status(200).json(messages);



    }catch(err){
        console.log("Error in getMessages controller", err);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    try{
     const {text,image} = req.body;
     const { id: receiverId } = req.params;
     const senderId = req.user._id;

     let imageUrl = "";
     if(image){
        const uploadedResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadedResponse.secure_url;
     }
    const message = await Message.create({
        senderId,
        receiverId,
        text,   
        image:imageUrl    
    })
    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message)
    }

     if(message){
        res.status(200).json(message);
     }


    }catch(err){
        console.log("Error in sendMessage controller", err);
        res.status(500).json({message: "Internal server error"});
    }
}