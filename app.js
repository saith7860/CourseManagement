import express from 'express';
import dotenv from 'dotenv';
import UserRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js';
import courseRouter from './routes/courseRouter.js';
if (process.env.NODE_ENV==="test") {
    dotenv.config({path:".env.test"})
}else{
    dotenv.config();
}

const app=express();
app.use(express.json());
app.use("/users",UserRouter);
app.use("/course",adminRouter);
app.use("/courses",courseRouter)
export default app;

