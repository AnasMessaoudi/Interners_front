const userModel = require('../Models/User');
const bcrypt = require('bcryptjs');
const { validateLogin, validateSignup } = require('../validators/auth.validator');
const ApiError = require('../Utils/ApiError');
const login = async (email,password)=>{
    validateLogin(email,password);
    const exists = await userModel.findOne({email})
    if(!exists){
        throw new ApiError(401,'Invalid Credentials !')
    }
    const res1 = await exists.comparePassword(password);
    if(!res1){
        throw new ApiError(401,'Invalid Credentials !')
    }
    return exists;
}
const signup = async(username,email,password)=>{
    validateSignup(username,email,password);
    const exists = await userModel.findOne({email:email});
    if(exists){
        throw new ApiError(409,'Email already used !');
    }
    const exists2 = await userModel.findOne({username:username});
    if(exists2){
        throw new ApiError(409,'username already used !');
    }
    const salt =  await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password,salt);
    const user = await userModel.create({username:username,email:email,password:hashed})
    return user;
}
const getAll = async (req,res)=>{
    const users = await userModel.find();
    if(users.length===0){
        throw new ApiError(400,'No users yet !');
    }
    return users;
}

module.exports = { login, signup,getAll };
