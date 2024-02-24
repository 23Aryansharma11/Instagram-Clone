import mongoose, {Schema} from "mongoose";

const reelSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    videoFile:{
        type:String, 
        required: true
    },
    thumbNail:{
        type: String,
        default: "" //By default keep the thumbnail as instagram logo
    },
    duration:{
        type: Number,
    },
    views:{
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

const  Reel = mongoose.model("Reel",reelSchema);
export default Reel