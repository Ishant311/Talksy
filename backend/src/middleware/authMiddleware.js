import jwt from "jsonwebtoken"
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