import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

const showAllCourses=async(req,res)=>{
    try {
      await Course.find({}).then((courses) => {
      res.json(courses);
    });
    } catch (error) {
        console.log("errro fetching courses", error);
        res.status(404).json({message:'error in fetching courses data'})
    }
}


//Data of specific course
const getSpecificCourse=async(req,res)=>{
    try {
        const courseId=req.params.id;
       
        console.log("id of the course",courseId);
        
        const courseData=await Course.findById(courseId)
        console.log(courseData);
        
        if (!courseData) {
            return res.json({message:"course with this id is not found" })
        }
        console.log("data of course based on id in database",courseData);
        return res.json({courseData:courseData})

    } catch (error) {
        console.log('Error in fetching course data',error);
        res.json({messsage:'Internal server error'})
        
    }
}


const buyCourse=async(req,res)=>{
    try {
        const userId=req.user.id;
        const courseId=req.params.id;
       
        console.log("id of the course",courseId);
        console.log("id of the user",userId);
        const courseData=await Course.findById(courseId);
        const userData=await User.findById(userId);
        console.log("course data is",courseData);
        console.log("user data is",userData);
        if (!courseData) {
            return res.json({message:"course with this id is not found" })
        }
        //updating the enrolled students in the course
        const updateEnrolledStudents=await Course.updateOne(courseData,{$push:{enrolledStudents:userId}});
        console.log(updateEnrolledStudents);
        //updating the enrolled courses for this user
         const updateEnrolledCourses=await User.updateOne(userData,{$push:{enrolledCourses:courseId}});
        console.log(updateEnrolledCourses);
       
        return res.json({message:"course buy succesfully"})

    } catch (error) {
        console.log('Error in buying course',error);
        res.json({messsage:'Internal server error'})
        
    }
}
export {showAllCourses,getSpecificCourse,buyCourse}