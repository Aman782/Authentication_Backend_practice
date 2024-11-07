import mongoose from "mongoose";
import { Schema } from "mongoose";

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type:String,
        required: true,
        unique: true,
    },

    password:{
        type:String,
        required: true,
    },

    refreshToken:{
        type:String,
    }
}, {timestamps: true});


userSchema.pre("save", async function(next){
   if(!this.isModified("password")){return next();}

   this.password = await bcrypt.hash(this.password, 10);
   next();
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(this.password, password);
}

userSchema.method.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        name:this.name,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)}



userSchema.method.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)}


export const User = mongoose.model('User', userSchema);