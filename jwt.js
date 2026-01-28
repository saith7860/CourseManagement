import  jwt  from "jsonwebtoken";
//verify token
const authMiddleware=(req,res,next)=>{
  const authHeader = req.headers.authorization;
if (!authHeader) {
  return res.status(401).json({ error: 'token missing' })
}
const token = authHeader.split(' ')[1];
    if (!token) {
       return res.json({error:'token not found'})
    }
    
    
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next()
    } catch (error) {
        console.log('error in verifying token',error);
        res.status(401).json('Unauthorized')
        
    }
}
//create token
const createToken=(userData)=>{
    try {
        return jwt.sign(userData,process.env.JWT_SECRET);
    } catch (error) {
        console.log('error in genterating token',error);
       
        
    }
    
}
export{createToken,authMiddleware}