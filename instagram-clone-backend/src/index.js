import app from "./app";
import connectDB from "./DB/index.js";
import dotenv from "dotenv"


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 5000}`)
    });
})
.catch((error)=>{
    console.log("Connection failed: ", error.message);
})
