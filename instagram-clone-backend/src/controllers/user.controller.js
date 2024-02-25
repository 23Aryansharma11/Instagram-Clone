import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { uploadToCloud, deleteFromCloud } from "../Utils/Cloudinary.js";
import generateAccessTokenAndRefreshToken from "../Utils/GenerateToken.js";



const options = {
    httpOnly: true,
    secure: true
}

const register = AsyncHandler(async (req, res)=>{
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
});

const login = AsyncHandler(async(req, res)=>{
    const {userName, email, password} = req.body;
    if(!userName && !email) throw new ApiError(400,  "Username or Email is required.");

    const user = User.findOne({$or: [{userName}, {email}]});
    if(!user) throw new ApiError(404, "User not found.");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) throw new ApiError(401, "Incorrect Password.");

    const {accessToken,  refreshToken} = await generateAccessTokenAndRefreshToken(user);
    // Remove password and token from output
    user.password = undefined;
    user.refreshToken = undefined;

    return res.status(200).json(new ApiResponse(200, {user, accessToken, refreshToken}, "Login successfull")).cookie("accessToken: ", accessToken, options).cookie("refreshToken: ", refreshToken, options);

});

const logout = AsyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: 1 // Can also do undefined
            }
        },
        {
            new: true,
        }
    );

    res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "Logout successfull"));
});

const refreshAccessToken = AsyncHandler(async (req, res)=>{
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingToken) throw new ApiError(401, "Unauthorized request");

    try {
        const decodedToken = jwt.verify(incomingToken,  process.env.REFRESH_TOKEN_SECRET);
        const user = await  User.findById(decodedToken?._id);
        if(!user) throw new ApiError(401, "Invalid access token");

        if(incomingToken !== user.refreshToken) throw new ApiError(401, "Refresh token expired or used");
        const {accessToken, refreshToken} = generateAccessTokenAndRefreshToken(user);
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {accessToken, refreshToken}, "Access token refreshed"));


    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
}); 

const update = AsyncHandler(async (req, res)=>{
    const {dateOfBirth, fullName, bio} = req.body;
    if(!dateOfBirth && !fullName && !bio) throw new ApiError(400, "Nothing to update.");

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set:{
            dateOfBirth,
            fullName,
            bio
        }
    }, {new: true}).select("-password");

    res.status(200).json(new ApiResponse(200, user, "Updated successfully"));
});
export {register, login, logout, refreshAccessToken, update}