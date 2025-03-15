import express from "express"
import authRoute from "./route/authRoute.js"
import cors from "cors"
import messageRoute from "./route/messageRoute.js"
import path from "path"

import {connectDB} from "./lib/db.js";
import {app , server } from "./lib/socket.js";
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.PORT;
//middleware
app.use(express.json({limit:"50mb"}));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

const __dirname = path.resolve();
//route
app.use("/api/auth",authRoute)
app.use("/api/message",messageRoute)
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  })
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});

