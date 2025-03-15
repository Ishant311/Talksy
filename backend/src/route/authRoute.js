import express from "express";
import { checkController, loginController, logoutController, registerController, updateProfileController } from "../controllers/authController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const route = express.Router();

route.post("/signup",registerController);
route.post("/login",loginController);
route.post("/logout",logoutController);

route.put("/update-profile",requireSignIn,updateProfileController);
route.get("/check",requireSignIn,checkController);


export default route;