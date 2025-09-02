import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: {
        type: String,
        default: ""
    },
    photoUrl: {
        type: String,
        default: ""
    },
    //  AGGIUNGI QUESTO CAMPO
    photoPublicId: {
        type: String,
        default: "", // O null, a seconda della tua preferenza
    },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    token: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null }
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)