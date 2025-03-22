import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        profilePic: {
            type: String,
            default: ""
        },
        chatsWith:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }]
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;