import Assignment from "../models/assignmentModel.js";
import isAdmin from "../common/isAdmin.js";
import Course from "../models/courseModel.js";
import Review from "../models/reviewsModel.js";
import User from "../models/userModel.js";
//handle erros
const handleErrors=(err)=>{
    const errors={rating:"",description:""}
    console.log(err.message,err.code);
    if (err.message.includes("User validation failed")) {
        (Object.values(err.errors)).forEach(({properties})=>{
          console.log(properties);
         errors[properties.path]=properties.message;
        })
    }
    return errors;
}


const addReview=async(req,res)=>{

    try {
     //getting user name fromm the token provided
     const userId=req.user.id;
     console.log(userId);
     
     const foundUser=await User.findById(userId);
     if (!foundUser) {
        return res.status(404).json({erorr:'user not found'})
     }
     console.log(foundUser.name);
     
     const userName=foundUser.name;
     //getting courseId
     const courseId=req.params.id;
     const courseFound= await Course.findById(courseId);
        if (!courseFound) {
            return res.status(404).json({error:'Course not found'})
        }
     console.log("user wants to do review is",userName);
     const {rating,description}=req.body;
     const newReview=new Review({
       rating,
       description,
       userName
     })
     const result=await newReview.save();
     console.log('result id is',result.id);
     
     const updateReview=await Course.updateOne(courseFound,{$push:{reviews:result.id}});
     console.log(updateReview);
     console.log('result of adding new review',result);
     res.json({response:result})
     
    } catch (error) {
        const errors=handleErrors(error);
        res.json(errors)
        // res.status(404).json({message:'error in adding a course'})
    }
}

const deleteReview=async(req,res)=>{
      const id=req.params.id;
    try {
       if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
        const response=await Review.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({error:'vidoe with this id is not found'})
        }
        console.log(response);
        res.json({message:"Review deleted successfully"})
    } catch (error) {
        console.log('error in deleting Review',error);
        res.status(500).json({error:'Internal server error'})
        
    }
}
export {addReview,deleteReview}