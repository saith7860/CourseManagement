import app from "./app.js";
import { connectDB } from "./utils/db.js";
const PORT=process.env.PORT||3000;
if (process.env.NODE_ENV!="test") {
    app.listen(PORT,()=>{
    connectDB();
    console.log('app is listening on port',PORT);
    
})
}


