import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const registerController = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" })
        }
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await userModel.create({ fullName, email, password: hashedPassword });
        if (newUser) {
            generateToken(newUser._id, res);
            res.status(201).json({
                message: "User created successfully",
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt
            })
        }
        else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const userExists = await userModel.findOne({ email });
        if (!userExists) {
            return res.status(400).json({ message: "Signup first" })
        }
        else {
            const isMatch = await bcrypt.compare(password, userExists.password);
            if (isMatch) {
                generateToken(userExists._id, res);
                return res.status(200).json(
                    {
                        message: "User logged in successfully",
                        _id:userExists._id,
                        fullName:userExists.fullName,
                        email:userExists.email,
                        profilePic:userExists.profilePic,
                        createdAt:userExists.createdAt
                    }
                )
            }
            else {
                return res.status(400).json({ message: "Incorrect Password" })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const logoutController = async (req, res) => {
    try {
        res.cookie("jwt","",{
            maxAge:0
        })
        res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
  
export const updateProfileController = async(req,res)=>{
    try {
        const {profilePic} = req.body
        const userId = req.user.id;
        if(!profilePic){
            return res.status(400).json({message:"Profile pic required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await userModel.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true}).select("-password");


        res.status(200).json({
            message: "User updated successfully",
            _id:updatedUser._id,
            fullName:updatedUser.fullName,
            email:updatedUser.email,
            profilePic:updatedUser.profilePic,
            createdAt:updatedUser.createdAt
        })
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const checkController = async(req,res)=>{
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        res.status(200).json({
            message: "User logged in successfully",
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            createdAt:user.createdAt
        });
    } catch (error) {
        return res.status(500).json({message:"Interanl Server Error"})
    }
}