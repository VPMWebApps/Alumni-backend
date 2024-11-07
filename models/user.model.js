import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        trim: true,
        minlength: 3,
        maxlength: 30,
        index: true
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\,.;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false
    },
    // passwordConfirm: {
    //     type: String,
    //     required: [true, "Please confirm your password"],
    //     validate: {
    //         validator: function(el) {
    //             return el === this.password;
    //         },
    //         message: "Passwords do not match"
    //     }
    // },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordOTPExpires: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'alumnus', 'staff'],
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
});

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();

    this.password = await bcryptjs.hash(this.password, 12);

    // this.passwordConfirmation = undefined;

    next();

});

userSchema.methods.correctPassword = async function (password, userPassword) {
    return await bcryptjs.compare(password, userPassword);
};



const User = mongoose.model('User', userSchema);

export default User;