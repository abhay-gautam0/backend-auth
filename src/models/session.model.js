import mongoose from "mongoose";


const sessionSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: [true, "User Is Required"]
    },
    refreshTokenHash:{
        type: String,
        required: [true, "Refresh Token hash is Required"]
    },
    ip:{
        type: String,
        required: [true, "Ip Address Is Required"]
    },
    userAgent:{
        type: String,
        required: [true, "User Agent Is Required"]
    },
    revoked:{
        type: Boolean,
        default: false,
    }
},{
    timestamps: true
})

const sessionModel = mongoose.model("sessions",sessionSchema)


export default sessionModel