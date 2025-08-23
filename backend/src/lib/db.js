import mongoose from "mongoose";

export const connectDB =  async() => {
   try{
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MONGODB CONNECTED" + conn.connection.host);    
   }
    catch(err){
     console.log("Error in connecting to database",err);
    }

}