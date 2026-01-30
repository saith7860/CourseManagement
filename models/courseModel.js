import mongoose from "mongoose";
const courseSchema = mongoose.Schema({
  title: {type:String,unique:true,require:[true,'Enter the title of the course'],minlength:[15,'Enter the title with minimum 15 characters']},
  duration:{
    type:String,
    require:true
  },
  description:{
    type:String,require:[true,'Enter the description of the course'],minlength:[25,'Enter the description with minimum 25 characters']
  },
  price:{
    type:Number,
    require:[true,'Enter the price of the course']
  },
  courseDetails:{
    type:String,
    require:[true,'Enter course details'],
    minlength:[150,'Enter the description with minimum 150 characters']
  },
  reviews: [
   {type:'ObjectId',
      ref:'Review'
    }
  ],
  enrolledStudents:[
    {type:'ObjectId',
      ref:'User'
    }
  ],
  videos:[ 
    {type:'ObjectId',
      ref:'Video',
      require:true
    }
  ],
  assignments:[
    {type:'ObjectId',
      ref:'Assignment',
      require:true
    }
  ],
  totalPurchases:{
    type:Number,
    default:0
  }
})
courseSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const  Course = mongoose.model('Course',courseSchema );
export default Course;