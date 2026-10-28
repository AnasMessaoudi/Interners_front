const validator = require('validator');
const bcrypt = require('bcryptjs');
const userModel = require('../Models/User');
const ApiError = require('../Utils/ApiError');

const validateLogin = (email,password)=>{
    if(!email || !password){
        throw new ApiError(400,'All fields must be filled !!'); 
    }
}
const validateSignup = (username,email,password)=>{
    if(!email || !password||!username){
        throw new ApiError(400,'All fields must be filled !!');
    }
    if(!validator.isEmail(email)){
        throw new ApiError(409,'Not valid email address !'); 
    }
    if(!validator.isStrongPassword(password)){
        throw new ApiError(409,'Weak password !'); 
    }
}
module.exports = {validateLogin,validateSignup};