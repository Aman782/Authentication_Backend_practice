
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";


export const validateJWT_Token = async (req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
          
          console.log("Token: ", token)
          // console.log(req);
          if(!token){
              return res.status(401).json("Unauthorized Access");
          }
          
          console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
    
          const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          
          console.log(decodedToken);
          const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
      
          console.log("User:", user);
          if(!user){
              return res.status(401).json("Invalid Access");
          }
      
          req.user = user;
          next();
    } catch (error) {
        return res.status(401).json(error.message|| "Invalid Access")
    }
}