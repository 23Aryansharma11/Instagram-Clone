import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { uploadToCloud, deleteFromCloud } from "../Utils/Cloudinary.js";


const registerUser = AsyncHandler(async (req, res)=>{
    const {fullName, userName, dateOfBirth, email, password} = req.body;

    if([fullName, userName, email, password].some((field) => field?.trim() == ""))  throw new ApiError(406, "All fields are required");

        const existedUser = await User.findOne({
        $or:  [{userName}, {email}]
        });
    if(existedUser) throw new ApiError(409, "Email or username already exists.");
        
    const avatarLocalFile = req.file?.path; 
    if(avatarLocalFile) {
        console.log(avatarLocalFile);
        const cloudResponseAvatar = await uploadToCloud(avatarLocalFile);
        if(!cloudResponseAvatar.url) throw new ApiError(501, "Unable to upload to cloud.");
            const dbUser = await User.create({
                fullName,
                email,
                userName,
                dateOfBirth,
                password,
                avatar: cloudResponseAvatar?.url
            });
            const createdUser = await User.findById(dbUser._id).select("-password -refreshToken");
            if(!createdUser) throw new ApiError(500,"Failed to create the account.");
            return res.status(201).json(new ApiResponse(201, createdUser,  "Account has been created successfully.") );
        }
        const dbUser = await User.create({
            fullName,
            email,
            userName,
            dateOfBirth,
            password
        });
        const createdUser = await User.findById(dbUser._id).select("-password -refreshToken");
        if(!createdUser) throw new ApiError(500,"Failed to create the account.");
        return res.status(201).json(new ApiResponse(201, createdUser,  "Account has been created successfully.") );
})


export {registerUser}