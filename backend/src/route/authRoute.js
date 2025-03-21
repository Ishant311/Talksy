import express from "express";
import { checkController, checkOtpController, loginController, logoutController, registerController, sendOtpController, updateProfileController, verifyOtpController } from "../controllers/authController.js";
import { otpVerified, requireSignIn } from "../middleware/authMiddleware.js";

const route = express.Router();

route.post("/signup",otpVerified,registerController);
route.post("/login",otpVerified,loginController);
route.post("/send-otp",sendOtpController);
route.post("/verify-otp",verifyOtpController);
route.post("/logout",logoutController);

route.put("/update-profile",requireSignIn,updateProfileController);
route.get("/check",requireSignIn,checkController);
route.get("/check-otp",otpVerified,checkOtpController);


export default route;