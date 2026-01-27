import mongoose from "mongoose";
const Mongo_Url=process.env.NODE_ENV==="test"? process.env.TEST_MONGO_URL:process.env.MONGO_URL;
//connecting database
const connectDB=async()=>{
    await mongoose.connect(Mongo_Url);
    console.log('database connected successfully');
}
//discoonecting database
const disconnectDB=async()=>{
    await mongoose.connection.close();
    console.log('connection closed successfully');
    
}
export {connectDB,disconnectDB};