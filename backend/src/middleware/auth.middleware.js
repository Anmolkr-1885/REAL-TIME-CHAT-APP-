import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try{
       const token = req.cookies.jwt;
         if(!token){
          return res.status(401).json({message: "Not authorized, token missing"});
         }
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if(!decodedToken){
              return res.status(401).json({message: "Not authorized, token invalid"});
            }
            const user = await User.findById(decodedToken.id);
            if(!user){
              return res.status(401).json({message: "Not authorized, user not found"});
            }
            req.user = user;
            next();

    }catch(err){
        console.log("Error in protectRoute middleware", err);
        res.status(500).json({message: "Internal server error"});
    }
}