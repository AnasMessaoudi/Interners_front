const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true,
        unique : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    cv: {
        fileName: {
            type: String,
            default: null
        },
        fileUrl: {
            type: String,
            default: null
        },
        extractedText: {
            type: String,
            default: null,
            select :false
        },
        uploadedAt: {
            type: Date,
            default: null
        }
    }
},{timestamps:true})

userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('userModel',userSchema)