import express from "express";
import { app, server } from "./lib/socket.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
app.use(cors({origin:"http://localhost:5173",credentials:true}));


import path from "path";
import cookieParser from "cookie-parser";
app.use(cookieParser());

const __dirname = path.resolve();

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB }from "./lib/db.js";

const PORT = process.env.PORT;
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/messages" ,messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
app.get(/(.*)/,(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/dist/index.html"));
})

}

server.listen(5001,()=>{
    console.log("Server is running on port:"+PORT);
     connectDB();
})