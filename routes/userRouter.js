import express from 'express';
import {getUsers,postUser,loginUser,getUserProfile,updateUserPassword} from '../controllers/userController.js';
import { createToken,authMiddleware } from '../jwt.js';
const UserRouter =express.Router();
UserRouter.get("/",getUsers);
UserRouter.post("/signup",postUser);
UserRouter.post("/login",loginUser);
UserRouter.get("/profile",authMiddleware,getUserProfile);
UserRouter.put("/profile/password",authMiddleware,updateUserPassword);

// UserRouter.patch("/:id",updateUser);
// UserRouter.delete("/:id",deleteUser);
export default UserRouter;