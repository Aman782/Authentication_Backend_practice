import mongoose from "mongoose";

export const dbConnection = async function main(){
   try{
       await mongoose.connect('mongodb://127.0.0.1:27017/authentications');
       console.log("DB Connected SuccessFully");
    }catch(err){
        console.log("MongoDB ERROR:", err);
    }
}



