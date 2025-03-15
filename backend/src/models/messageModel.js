import mongoose, { Mongoose } from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",      
            required: true
        },
        recieverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",      
            required: true
        },
        text: {
            type: String,
        },
        image: {
            type: String
        }
    },
    { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;