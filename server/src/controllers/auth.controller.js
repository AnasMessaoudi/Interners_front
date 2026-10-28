const {login,signup,getAll} = require('../services/auth.services');
const jwt = require('jsonwebtoken');

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'3d'});
};

const handleLogin = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        const user = await login(email,password);
        const token = createToken(user._id);
        res.status(201).json({
            user : user.username,
            message:'Logged successfully',
            token : token 
        });
    }catch(err){
        next(err);
    }
}
const handleSignup = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = await signup(username,email,password);
        const token = createToken(user._id);
        res.status(201).json({
            user : user.username,
            message:'Signed up successfully',
            token : token
        });
    }catch(err){
        console.log(err);
        next(err);
    }
}
const handleGetAll = async(req,res,next)=>{
    try{
        const users = await getAll();
        res.status(200).json({
            users : users
        });
    }catch(err){
        next(err);
    }
}
const me = async(req,res)=>{
    res.status(200).json({username:req.user.username, email:req.user.email,hasCv: Boolean(req.user.cv?.fileName)});
}

module.exports = {handleLogin, handleSignup,me,handleGetAll}