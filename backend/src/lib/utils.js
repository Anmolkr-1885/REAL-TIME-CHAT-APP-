import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const generateToken = (user,res) => {
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie("jwt", token, { 
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production' });
      return token;
        
}
  