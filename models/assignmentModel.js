import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Enter the asssi"],
    minlength: [10, "Enter a title with minimum 10 characters"],
  },
   url:{
    type:String,
    require:[true,'Enter the url of the assignment']
  },
    isCompleted:{
    type:Boolean,
    default:false
  },
})
assignmentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
   
  },
});
const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
