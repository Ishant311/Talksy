import express from "express"
import { requireSignIn } from "../middleware/authMiddleware.js"
import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/messageController.js";

const route = express.Router()

route.get("/users",requireSignIn,getUsersForSidebar);
route.get("/:id",requireSignIn,getMessages);
route.post("/send/:id",requireSignIn,sendMessages);



export default route