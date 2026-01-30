import mongoose from "mongoose";
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Enter the title"],
    minlength: [10, "Enter a title with minimum 10 characters"],
  },
   description:{
    type:String,require:[true,'Enter the description of the course'],minlength:[25,'Enter the description with minimum 25 characters']
  },
   duration:{
    type:String,
    require:[true,'Enter the duration of the video']
  },
   url:{
    type:String,
    require:[true,'Enter the url of the video']
  },
    isCompleted:{
    type:Boolean,
    default:false
  },
 courses:[
    {type:'ObjectId',
      ref:'Course',
      require:[true,'Enter the id of the course this video belongs']
    }
  ],
})
videoSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
   
  },
});
const Video = mongoose.model("Video",videoSchema );
export default Video;
