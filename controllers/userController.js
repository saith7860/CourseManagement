import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { createToken,authMiddleware } from "../jwt.js";
const handleErrors=(err)=>{
    const errors={name:'',email:'',password:''}
    console.log(err.message,err.code);
    if (err.message.includes("User validation failed")) {
        (Object.values(err.errors)).forEach(({properties})=>{
          console.log(properties);
         errors[properties.path]=properties.message;
        })
    }
    if (err.code==11000) {
        errors['email']="User with this email already exits"
        return errors.email;
    }
    return errors;
}
const saltRounds=10;
const getUsers=async(req,res)=>{
    try {
      await User.find({}).then((users) => {
      res.json(users);
    });
    } catch (error) {
        console.log("errro fetching user", error);
        res.status(404).json({message:'error in fetching users data'})
    }
}
//signup user
const postUser=async(req,res)=>{
  console.log(req.body);
  
try {
  const { name,email, password } = req.body;
//   if (req.body['role']) {
//     const role=req.body.role;
//   }
  if (!(password.length>=6)) {
    res.json({error:'password length should be greater or equal to 6'});
    return;
  }
  
  
  const hashPassword=await bcrypt.hash(password,saltRounds);
    
       const user=new User({
        name,
        email,
        hashPassword,
       })
        const result=await user.save();
        const payLoad={
            id:result.id,
        }
        const token=createToken(payLoad);

        res.status(201).json({result:result,token:token})
        
    } catch (error) {
      const errors= handleErrors(error);
      console.log(errors);
      
      res.status(400).json({error:errors})
      
        // console.log('error creating a user',error);

        // res.status(401).json({message:'Invalid or bad request.UserName or email is missing'})
        
    }
}
//login user
const loginUser=async(req,res)=>{
  try {
    const {email,password}=req.body;
    const user=await User.findOne({email:email});
    if (!user) {
        return res.status(404).json({message:"User not found with this email"})
    }
    const passwordComparison=await bcrypt.compare(password,user.hashPassword);
    if (!passwordComparison) {
        return res.status(404).json({message:"Invalid credentials.Password is incorrect"})
    }
    const payLoad={
            id:user.id,
        }
        const token=createToken(payLoad);
        res.status(200).json({token:token})
  } catch (err) {
    console.log('Error logging in',err);
    res.status(500).json({error:"Internal server error"})
    
  }
}
//Profile of specific user
const getUserProfile=async(req,res)=>{
    try {
        const userID=req.user.id;
       
        console.log("id of the user",userID);
        
        const userData=await User.findById(userID)
        console.log(userData);
        
        if (!userData) {
            return res.json({message:"user with this id is not found" })
        }
        console.log("data of user based on id in database",userData);
        return res.json({userData:userData})

    } catch (error) {
        console.log('Error in fetching user data',error);
        res.json({messsage:'Internal server error'})
        
    }
}
//update password for specific user 
const updateUserPassword=async(req,res)=>{
    try {
        const {currentPassword,newPassword}=req.body;
        const userID=req.user.id;
        console.log("userID",userID);
        
       const user=await User.findById(userID);
       console.log("user before saving password",user);
       
        if (!user) {
            return res.json({message:"user with this id is not found" })
        } 
     const passwordComparison=await bcrypt.compare(currentPassword,user.hashPassword);
    if (!passwordComparison) {
        return res.status(404).json({message:"Invalid credentials.Password is incorrect"})
    }
    const newPasswordHashing=await bcrypt.hash(newPassword,saltRounds)
     user.hashPassword=newPasswordHashing;
     await user.save();
     console.log("user after saving password",user);
     
//    const updatePassword=await User.updateOne({id:response.id},{$set:{hashPassword:newPasswordHashing}})

//    console.log(updatePassword);
   res.json({message:"Password is updated successfully"})
   

    } catch (error) {
        console.log('Error in fetching user data',error);
        res.json({messsage:'Internal server error'})
        
    }
}

export {getUsers,getUserProfile,updateUserPassword,postUser,loginUser}