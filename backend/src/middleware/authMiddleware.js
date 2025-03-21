import jwt from "jsonwebtoken"


export const otpVerified = async(req,res,next)=>{
    try {
        if(!req.cookies.verifiedOtp){
            return res.status(401).json({message:"Verify OTP first"});
        }
        const decodedOtp = jwt.verify(req.cookies.verifiedOtp,process.env.OTP_SECRET);
        if(!decodedOtp){
            return res.status(400).json({message:"Invalid OTP"});
        }
        next();
    } catch (error) {
        return res.status(400).json({message:"You need to verify OTP first"});
    }
} 
export const requireSignIn = async(req,res,next)=>{
    try {
        if(!req.cookies.jwt){
            return res.status(401).json({message:"UnAuthorized- No token Provided"});
        }
        const decoded = jwt.verify(req.cookies.jwt,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"UnAuthorized-invalid token"});
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({message:"You need to login or signup first"});
    }
}