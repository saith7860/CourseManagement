import express from 'express';
import {addReview,deleteReview} from '../controllers/reviewController.js';
import {authMiddleware } from '../jwt.js';
const reviewRouter =express.Router();
reviewRouter.post("/:id/addreview",authMiddleware,addReview);
reviewRouter.delete("/:id/deletereview",authMiddleware,deleteReview);
export default reviewRouter;