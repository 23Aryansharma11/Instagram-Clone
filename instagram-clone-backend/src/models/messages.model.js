import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    from:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    to:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    message:{
        type: String,
        required: true
    },

}, {timestamps: true})

const Message = mongoose.model("Message", messageSchema);

export default Message