import { DB_NAME } from "../constants";
import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Connected to database: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Unable to connect to the database "+ error);
        process.exit(1);
    }
}

export default connectDB;