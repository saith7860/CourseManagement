import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { createToken,authMiddleware } from "../jwt.js";
import Course from "../models/courseModel.js";
import { updateUserPassword } from "./userController.js";
//handling user validation and duplication errors
const handleErrors=(err)=>{
    const errors={title:'',desription:'',price:"",courseDetails:"",duration:""}
    console.log(err.message,err.code);
    if (err.message.includes("User validation failed")) {
        (Object.values(err.errors)).forEach(({properties})=>{
          console.log(properties);
         errors[properties.path]=properties.message;
        })
    }
    return errors;
}
//checking if the user has admin role or not
const isAdmin=async(userID)=>{
    try {
   const user=await User.findById(userID);
   if (!user) {
   return  res.status(404).json({error:'user with this id is not found'});
   }
   console.log(user.role);
   
   if (user.role=='admin') {
    return true;
   }
    } catch (error) {
       console.log(error);
        return false; 
    }
  
}

const addCourse=async(req,res)=>{

    try {
       if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
     const {title,duration,description,price,courseDetails}=req.body;
     const foundCourse=await Course.findOne({title:title});
     if (foundCourse) {
        return res.json({error:"course with with title already exists"})
     }
     const newCourse=new Course({
        title,
        description,
        price,
        duration,
        courseDetails
     })
     const result=await newCourse.save();
     console.log('result of adding new course',result);
     res.json({response:result})
     
    } catch (error) {
        const errors=handleErrors(error);
        res.json(errors)
        // res.status(404).json({message:'error in adding a course'})
    }
}
const updateCourse=async(req,res)=>{
    const id=req.params.id;
    console.log(id);
    
    try {
         if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
    //    const data=req.body;
        const course=await Course.findById(id);
        const updateCourse=await Course.updateOne(course,{$set:req.body})
        // await course.save();
        console.log("course before updating",course);
        console.log("course after updating",updateCourse);
        

        res.json({response:updateCourse})
        
        // res.status(200).json(response);
    } catch (error) {
        console.log('error in updating the course',error);
        res.json({error:'Internal server error'})
        
        // console.log('error in pushing blog ids in array of blogs in user schmea',error);
        // res.status(400).json({message:"blog id not pushed"})
        
    }
}
const deleteCourse=async(req,res)=>{
      const id=req.params.id;
    try {
         if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
        const response=await Course.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({error:'course with this id is not found'})
        }
        console.log(response);
        res.json({message:"course deleted successfully"})
    } catch (error) {
        console.log('error in deleting course',error);
        res.status(500).json({error:'Internal server error'})
        
    }
}

export {addCourse,updateCourse,deleteCourse}