import mongoose from "mongoose";
import { float } from "webidl-conversions";
const reviewSchema = new mongoose.Schema({
 userName: {
    type: String,
    require: true,
 },
   rating:{
    type:Number,
    require:[true,'Enter the rating of course'],
   },
    description:{
    type:String,
    require:[true,'Enter the description of the review'],minlength:[10,'Enter the description with minimum 10 characters']
  },
})
reviewSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
   
  },
});
const Review = mongoose.model("Review",reviewSchema );
export default Review;
