import { User } from "../models/user.models.js";

export const registerUser = async (req, res) => {
   try {
      const { username, email, password } = req.body;

      // Check for missing fields
      if ([username, email, password].some((field) => field?.trim() === "")) {
         return res.status(401).json({ message: "All fields are required" });
      }

      // Check if email or username already exists
      const userExists = await User.findOne({
         $or: [{ username }, { email }]
      });

      if (userExists) {
         return res.status(400).json({ message: "User already exists" });
      }

      // Create a new user
      const createdUser = await User.create({
         username,
         email,
         password
      });

      // Fetch user data without password and refreshToken
      const resUser = await User.findById(createdUser._id).select("-password -refreshToken");

      if (!resUser) {
         return res.status(500).json({ message: "Something went wrong" });
      }

      return res.status(201).json(resUser);
   } catch (error) {
      res.status(500).json({ message: error.message || "Internal Server Error" });
   }
};

const generateAccessTokenAndRefreshToken = async (userId)=>{
    const user = await User.findOne(userId);
    
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
}


export const loginUser = async (req, res)=>{
    // take user credentials from req body
    // check for validation
    // check for user exists or not 
    // check password correct or not
    // generateRefreshToken & generateAccessToken 
    // save refreshToken into user object in db
    // create cookies 
    // return res 


    const {username, email, password} = req.body;

    if(!username && !email){
        res.status(401).json("username or email required");
    }



    const user = await User.findOne({
        $or: [{username}, {email}]
    });

    if(!user){
        res.status(404).json("User does not Exists");
    }

    const validatePassword = await user.isPasswordCorrect(password);

    if(!validatePassword){
       res.status(401).json("Incorrect Credentials, try again");
    }

    const updatedUser = await User.findOne({
        $or: [{username}, {email}]
    }).select("-password -refreshToken");


    const {accessToken, refreshToken} = generateAccessTokenAndRefreshToken(updatedUser._id);

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        "accessToken": accessToken,
        "refreshToken": refreshToken,
        "message": "User LoggedIn Successfully"
    });    
}

export const logoutUser = async (req, res)=>{
  
} 