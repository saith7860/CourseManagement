import mongoose from "mongoose";
import validator from 'validator';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Enter a name"],
    minlength: [3, "Enter a name with minimum 6 characters"],
  },
  email: {
    type: String,
    require: [true, "Enter an email"],
    unique: true,
    validate: [validator.isEmail, "Enter a valid email"],
  },
  role:{
    type:String,
    enum:['admin','user'],
    default:'user'
  },
  isCourseCompleted:{
    type:Boolean,
    default:false
  },

  hashPassword: {
    type: String,
    require: [true, "Enter a password"],
    minlength: [6, "Enter a password with minimum 6 characters"],
  },
  enrolledCourses: [{ type: "ObjectId", ref: "Course" }],
});
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.hashPassword;
  },
});
const User = mongoose.model("User", userSchema);
export default User;
