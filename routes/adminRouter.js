import express from "express";
import { addCourse ,updateCourse,deleteCourse} from "../controllers/adminController.js";
import { authMiddleware } from "../jwt.js";
const adminRouter = express.Router();
adminRouter.post("/addcourse",authMiddleware, addCourse);
adminRouter.patch("/:id",authMiddleware, updateCourse);
adminRouter.delete("/:id",authMiddleware, deleteCourse);
export default adminRouter;
