import express from "express";
import { loginUser, registerUser, verifyToken } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/verify", verifyToken); // ✅ New route for verifying token

export default userRouter;
