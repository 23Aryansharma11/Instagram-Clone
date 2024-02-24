import mongoose, {Schema} from "mongoose";

const postSchema = new Schema({
    caption:{
        type: String,
        required: true,
    },
    likes:{
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

const  Post = mongoose.model("Post",postSchema);
export default Post;