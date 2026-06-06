import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is Required"],
        unique:[true,"Username is unique"]
    },
    email:{
        type:String,
        required:[true,"Email is Required"],    
        unique:[true,"Email is unique"]
    },
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
    verified:{
        type: Boolean,
        default:false
    }
})

const userMODEL = mongoose.model("users",userSchema)

export default userMODEL;