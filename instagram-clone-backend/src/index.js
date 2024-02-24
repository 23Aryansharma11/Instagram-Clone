import {app} from "./app.js";
import connectDB from "./DB/index.js";
import dotenv from "dotenv";

dotenv.config({path:"./env"});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 5000}`)
    });
})
.catch((error)=>{
    console.log("Connection failed: ", error.message);
})
