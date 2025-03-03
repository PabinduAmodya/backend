import express from 'express';
import { createUser, getUser, loginUser } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.get("/",getUser)

userRouter.post("/", createUser)
userRouter.post("/login", loginUser)


export default userRouter;