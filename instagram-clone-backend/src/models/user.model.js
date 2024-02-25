import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new Schema({

    fullName:{
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    email:{
        type:String,  
        unique :true , 
        lowercase: true,  
        trim: true,
        required: true
    },
    userName: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        default: "" // TODO: upload a cloudinary default  image for the user.
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken:{
        type: String,

    },
    uploadedPosts: [
       { type: Schema.Types.ObjectId,
        ref: "Post"}
    ],
    uploadedReel:[
        { type: Schema.Types.ObjectId,
            ref: "Reel"}
    ],
    likedPosts: [
        { type: Schema.Types.ObjectId,
        ref: "Post"}
    ],
    likedReel:[
        { type: Schema.Types.ObjectId,
        ref: "Reel"}
    ],
    isVerified:{
        type: Boolean,
        default:false
    },
    followers:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    conversation:[
        {
            type: Schema.Types.ObjectId,
            ref: "Message"
        }
    ],
    bio:{
        type: String,
        default: ""
    }

}, {
    timestamps: true
});


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await  bcrypt.hash(this.password, 10);
    next();
})

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = async function(){
    return jwt.sign({
        _id: this._id,
        userName: this.userName
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.method.generateRefreshToken = async function(){
    return jwt.sign({
        _id: this._id,
        userName: this.userName
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

const User = mongoose.model("User", userSchema);
export default User