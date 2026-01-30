import User from "../models/userModel.js";
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
export default isAdmin;