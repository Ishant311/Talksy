import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import otpModel from "../models/OtpModel.js"
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const generateOtp = ()=>{
    return Math.floor(100000 + Math.random() * 900000);
}
export const sendOtpController = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({message:"Email is required"})
        }
        const otpAlreadyExists = await otpModel.findOne({ email });
        if(otpAlreadyExists){
            await otpModel.findByIdAndDelete(otpAlreadyExists._id);
        }
        const otp = generateOtp();
        const newOtp = await otpModel.create({email,otp});
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "OTP for Sign in",
            text: `Your OTP is ${otp} and it will expire in 10 minutes`
        });
        console.log("Message sent: ", info.messageId);
        return res.status(200).json({message:"OTP sent successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const verifyOtpController = async (req, res) => {
    try {
        const { userTypedOtp, email } = req.body;
        if(!userTypedOtp || !email){
            return res.status(400).json({message:"otp and email is required"})
        }
        const otpExists = await otpModel.findOne({ email });
        if(!otpExists){
            return res.status(400).json({message:"Send Otp first"});
        }
        else{
            if(otpExists.otp === userTypedOtp){
                const otpToken = jwt.sign({
                    id:otpExists._id,
                },process.env.OTP_SECRET,{
                    expiresIn:"7d"
                })
                res.cookie("verifiedOtp",otpToken,{
                    maxAge:1000*60*60*24*7,
                    httpOnly:true,
                    sameSite:true,
                    secure:process.env.NODE_ENV!=="development"
                })
                return res.status(200).json({message:"OTP verified successfully"});
            }
            else{
                return res.status(400).json({message:"Incorrect OTP"});
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
};

export const registerController = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            res.cookie("verifiedOtp","",{
                maxAge:0
            })
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            res.cookie("verifiedOtp","",{
                maxAge:0
            })
            return res.status(400).json({ message: "Password must be atleast 6 characters" })
        }
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            res.cookie("verifiedOtp","",{
                maxAge:0
            })
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
            res.cookie("verifiedOtp","",{
                maxAge:0
            })
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
            res.cookie("verifiedOtp","",{
                maxAge:0
            })
            return res.status(400).json({ message: "All fields are required" })
        }
        const userExists = await userModel.findOne({ email });
        if (!userExists) {
            res.cookie("verifiedOtp","",{
                maxAge:0
            })
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
                res.cookie("verifiedOtp","",{
                    maxAge:0
                })
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
        res.cookie("verifiedOtp","",{
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
export const checkOtpController = async(req,res)=>{
    try {
        res.status(200).json({message:"OTP verified"});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }
}