import mongoose, {Schema, Document, Mongoose} from "mongoose";

export interface Message extends Document{
    Content: string;
    createdAt: Date
}

const MessageSchema:Schema<Message> =  new Schema({
    Content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: String;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerfied: boolean;
    isAcceptingMessage: boolean;
    message: Message[]

}

const  Userschema:Schema<User> =  new Schema({
        username:{
            type: String,
            required:[true, "Username is required"],
            trim: true,
            unique: true
        },
        email:{
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/.+\@.+\..+/, 'please use a vaid email address']
        },
        password:{
            type: String,
            required:[true, "Password is required"]
        },
        verifyCode:{
            type: String,
            required: [true, "Verify code is required"]
        },
        verifyCodeExpiry:{
            type: Date,
            required: [true, "Verify code Expirary is required"]
        },
        isVerfied:{
            type: Boolean,
            required: [true, "Verify code Expiry is required"]
        },
        isAcceptingMessage:{
            type: Boolean,
            default: true
        },
        message:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",Userschema)

export default UserModel