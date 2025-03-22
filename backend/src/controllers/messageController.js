import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
import messageModel from "../models/messageModel.js"
import userModel from "../models/userModel.js";


export const searchUsers = async(req,res)=>{
    try {
        const userId = req.user.id;
        const {searchQuery} = req.body;
        const users = await userModel.find({
            _id:{$ne:userId},
            $or:[
                {fullName:{$regex:searchQuery,$options:"i"}},
                {email:{$regex:searchQuery,$options:"i"}}
            ]
        }).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"});
    }
}
export const getUsersForSidebar = async(req,res)=>{
    try {
        const userId = req.user.id;
        const users = await userModel.findById(userId).select("-password").populate("chatsWith","-password");
        res.status(200).json(users.chatsWith);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"});
    }
}
export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user.id;
        const messages = await messageModel.find({
            $or:[
                {senderId:myId,recieverId:userToChatId},
                {senderId:userToChatId,recieverId:myId}
            ]
        })
        if(messages){
            return res.status(200).json({
                messages
            })
        }
        return res.status(404).json({
            message:"No Chat exists b/w user"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"});
    }
}
export const sendMessages = async(req,res)=>{
    try {
        const {text,image} = req.body;
        const {id:recieverId} = req.params;
        const senderId = req.user.id;
        const addUsertoSenderSchema = await userModel.findByIdAndUpdate(
            senderId,
            {$addToSet:{chatsWith:recieverId}},
            {new:true}
        )
        const addUsertoRecieverSchema = await userModel.findByIdAndUpdate(
            recieverId,
            {$addToSet:{chatsWith:senderId}},
            {new:true}
        )
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new messageModel({
            senderId,
            recieverId,
            text,
            image:imageUrl
        });
        await newMessage.save();

        const recieverSocketId = getRecieverSocketId(recieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json({
            _id:newMessage._id,
            senderId:newMessage.senderId,
            recieverId:newMessage.recieverId,
            text:newMessage.text,
            image:newMessage.image,
            createdAt:newMessage.createdAt
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"});
    }

}