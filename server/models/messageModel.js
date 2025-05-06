import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema({
    content: String,
    attachments: {
        type: [String],
        default: undefined       // So it is not stored if empty
    },
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    chat: {
        type: Types.ObjectId,
        ref: "Chat",
        required: true,
    },
}, { timestamps: true })

const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)

export default messageModel;