import express from 'express';
import {showAllCourses,getSpecificCourse,buyCourse} from '../controllers/courseController.js';
import {authMiddleware } from '../jwt.js';
const courseRouter =express.Router();
courseRouter.get("/",authMiddleware,showAllCourses);
courseRouter.get("/:id",authMiddleware,getSpecificCourse);
courseRouter.patch("/:id/buy",authMiddleware,buyCourse);
export default courseRouter;