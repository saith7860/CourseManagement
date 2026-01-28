import express from 'express';
import dotenv from 'dotenv';
import UserRouter from './routes/userRouter.js';
if (process.env.NODE_ENV==="test") {
    dotenv.config({path:".env.test"})
}else{
    dotenv.config();
}

const app=express();
app.use(express.json());
app.use("/user",UserRouter)
export default app;
