import {v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
    api_key: String(process.env.CLOUDINARY_API_KEY),
    api_secret: String(process.env.CLOUDINARY_API_SECRET)
});

//Upload and delete
const uploadToCloud = async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
         fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("Unable to post to the  cloudinary: "+ error);
        console.log("Unlinking the files...");
        fs.unlinkSync(localFilePath);
    }
};

const deleteFromCloud = async (publicUrl)=> {
    try {
        const publicId = cloudinary.utils.publicId(publicUrl);
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log("Unable to delete file from cloudinary: "+ error)
    }
}

export {uploadToCloud, deleteFromCloud}