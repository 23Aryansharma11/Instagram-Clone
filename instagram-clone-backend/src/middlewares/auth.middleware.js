import User from "../models/user.model";
import AsyncHandler from "../Utils/AsyncHandler";
import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError";

export const verifyJwt = AsyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authentication"?.replace("Bearer ", ""));
        if(!token) throw new ApiError(401, "Please Authenticate first");
    
        const decodedToken = jwt.verify(token,  process.env.ACCESS_TOKEN_SECRET);
        const user = User.findById(decodedToken._id).select("-password -refreshToken");
    
        if(!user) throw new ApiError(401, "Invalid access token");
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Auth failed");
    }
});