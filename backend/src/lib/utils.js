import jwt from "jsonwebtoken"
export const generateToken = async (id,res)=>{
    const token = jwt.sign({
        id
    },process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("jwt",token,{
        maxAge:1000*60*60*24*7,
        httpOnly:true,
        sameSite:true,
        secure:process.env.NODE_ENV!=="development"
    }) 
    return token;
}