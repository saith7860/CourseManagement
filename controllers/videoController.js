import Course from "../models/courseModel.js";
import Video from "../models/videoModel.js";
import isAdmin from "../common/isAdmin.js";
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
        errors['title']="Video with this title already exits"
        return errors.title;
    }
    return errors;
}
const showAllVideos=async(req,res)=>{
    console.log(req.user.id);
    
    try {
       if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
      await Video.find({}).populate('courses').then((videos) => {
      res.json(videos);
    });
    } catch (error) {
        console.log("errro fetching videos", error);
        res.status(404).json({error:'error in fetching vidoes data'})
    }
}


//Data of specific video
const getSpecificVideo=async(req,res)=>{
    try {
        const videoId=req.params.id;
       
        console.log("id of the vidoe",videoId);
        
        const videoData=await Video.findById(videoId)
        console.log(videoData);
        
        if (!videoData) {
            return res.json({message:"video with this id is not found" })
        }
        console.log("data of video based on id in database",videoData);
        return res.json({videoData:videoData})

    } catch (error) {
        console.log('Error in fetching video data',error);
        res.json({error:'Internal server error'})
        
    }
}


const addVideo=async(req,res)=>{

    try {
       if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
     const {title,duration,description,url,courses}=req.body;
     
        courses.forEach(async(course)=>{
       const courseFound= await Course.findById(course);
        if (!courseFound) {
            return res.status(404).json({error:'Course not found'})
        }
        })
     
     const foundVideo=await Video.findOne({title:title});
     if (foundVideo) {
        return res.json({error:"video with with title already exists"})
     }
     const courseValidation=await Promise.all(
        courses.map((courseId)=> Course.findById(courseId))
     )
     if (courseValidation.includes(null)) {
      return res.status(404).json({ error: 'One or more courses not found' });
    }
     const newVideo=new Video({
        title,
        description,
        duration,
        url,
        courses
     })
     const result=await newVideo.save();
     console.log('result of adding new video',result);
     res.json({response:result})
     
    } catch (error) {
        const errors=handleErrors(error);
        res.json(errors)
        // res.status(404).json({message:'error in adding a course'})
    }
}
const updateVideo=async(req,res)=>{
    const id=req.params.id;
    console.log(id);
    
    try {
         if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
    //    const data=req.body;
        const video=await Video.findById(id);
        const updateVideo=await Video.updateOne(video,{$set:req.body})
        // await course.save();
        console.log("video before updating",video);
        console.log("video after updating",updateVideo);
        

        res.json({response:updateVideo})
        
        // res.status(200).json(response);
    } catch (error) {
        console.log('error in updating the video',error);
        res.json({error:'Internal server error'})
        
        // console.log('error in pushing blog ids in array of blogs in user schmea',error);
        // res.status(400).json({message:"blog id not pushed"})
        
    }
}
const deleteVideo=async(req,res)=>{
      const id=req.params.id;
    try {
         if (!(await isAdmin(req.user.id))) {

        return res.status(403).json({error:'user does not have admin role'})
       } 
        const response=await Video.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({error:'vidoe with this id is not found'})
        }
        console.log(response);
        res.json({message:"video deleted successfully"})
    } catch (error) {
        console.log('error in deleting video',error);
        res.status(500).json({error:'Internal server error'})
        
    }
}
export {showAllVideos,getSpecificVideo,addVideo,updateVideo,deleteVideo}