import express from 'express';
import dotenv from 'dotenv';
import UserRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js';
import courseRouter from './routes/courseRouter.js';
import videoRouter from './routes/videoRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import assignmentRouter from './routes/assignmentsRouter.js';
if (process.env.NODE_ENV==="test") {
    dotenv.config({path:".env.test"})
}else{
    dotenv.config();
}

const app=express();
app.use(express.json());
app.use("/api/users",UserRouter);
app.use("/api/course",adminRouter);
app.use("/api/courses",courseRouter);
app.use("/api/videos",videoRouter);
app.use("/api/reviews",reviewRouter);
app.use("/api/assignments",assignmentRouter);


export default app;

