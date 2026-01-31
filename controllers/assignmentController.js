import Assignment from "../models/assignmentModel.js";
import isAdmin from "../common/isAdmin.js";
import Course from "../models/courseModel.js";
//handle erros
const handleErrors=(err)=>{
    const errors={title:'',desciption:'',duration:'',url:'',course:''}
    console.log(err.message,err.code);
    if (err.message.includes("User validation failed")) {
        (Object.values(err.errors)).forEach(({properties})=>{
          console.log(properties);
         errors[properties.path]=properties.message;
        })
    }
    if (err.code==11000) {
        errors['title']="Assignment with this title already exits"
        return errors.title;
    }
    return errors;
}
const showAllAssignments=async(req,res)=>{
    console.log(req.user.id);
    
    try {
       if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
      await Assignment.find({}).populate('courses').then((assignments) => {
      res.json(assignments);
    });
    } catch (error) {
        console.log("errro fetching Assignments", error);
        res.status(404).json({error:'error in fetching vidoes data'})
    }
}


//Data of specific Assignment
const getSpecificAssignment=async(req,res)=>{
    try {
        const AssignmentId=req.params.id;
       
        console.log("id of the vidoe",AssignmentId);
        
        const AssignmentData=await Assignment.findById(AssignmentId)
        console.log(AssignmentData);
        
        if (!AssignmentData) {
            return res.json({message:"Assignment with this id is not found" })
        }
        console.log("data of Assignment based on id in database",AssignmentData);
        return res.json({AssignmentData:AssignmentData})

    } catch (error) {
        console.log('Error in fetching Assignment data',error);
        res.json({error:'Internal server error'})
        
    }
}


const addAssignment=async(req,res)=>{
const id=req.params.id;
console.log('id of the course to which assignment is added is',id);

    try {
       if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
     const {title,url,courses}=req.body;
     
    //  courses.forEach(async(course)=>{
    //    const courseFound= await Course.findById(course);
    //     if (!courseFound) {
    //         return res.status(404).json({error:'Course not found'})
    //     }
    //     })
     
     const foundAssignment=await Assignment.findOne({title:title});
     if (foundAssignment) {
        return res.json({error:"Assignment with with title already exists"})
     }
     const courseValidation=await Promise.all(
        courses.map((courseId)=> Course.findById(courseId))
     )
     if (courseValidation.includes(null)) {
      return res.status(404).json({ error: 'One or more courses not found' });
    }
     const newAssignment=new Assignment({
        title,
        url,
        courses
     })
     const result=await newAssignment.save();
      const updateAssignments=await Course.updateOne(courseValidation,{$push:{assignments:id}});
     console.log(updateAssignments);
     console.log('result of adding new Assignment',result);
     res.json({response:result})
     
    } catch (error) {
        const errors=handleErrors(error);
        res.json(errors)
        // res.status(404).json({message:'error in adding a course'})
    }
}
const updateAssignment=async(req,res)=>{
    const id=req.params.id;
    console.log(id);
    
    try {
         if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
    //    const data=req.body;
        const assignment=await Assignment.findById(id);
        const updateAssignment=await Assignment.updateOne(assignment,{$set:req.body})
        // await course.save();
        console.log("Assignment before updating",Assignment);
        console.log("Assignment after updating",updateAssignment);
        

        res.json({response:updateAssignment})
        
        // res.status(200).json(response);
    } catch (error) {
        console.log('error in updating the Assignment',error);
        res.json({error:'Internal server error'})
        
        // console.log('error in pushing blog ids in array of blogs in user schmea',error);
        // res.status(400).json({message:"blog id not pushed"})
        
    }
}
const deleteAssignment=async(req,res)=>{
      const id=req.params.id;
    try {
         if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
        const response=await Assignment.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({error:'vidoe with this id is not found'})
        }
        console.log(response);
        res.json({message:"Assignment deleted successfully"})
    } catch (error) {
        console.log('error in deleting Assignment',error);
        res.status(500).json({error:'Internal server error'})
        
    }
}
export {showAllAssignments,getSpecificAssignment,addAssignment,updateAssignment,deleteAssignment}