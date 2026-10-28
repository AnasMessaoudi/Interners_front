const jwt = require('jsonwebtoken');
const userModel = require('../Models/User');
const ApiError = require('../Utils/ApiError');

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Not authorized, no token');
        }

        const token = authHeader.split(' ')[1]; 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user) {
            throw new ApiError(401, 'User no longer exists');
        }
        req.user = user; // attach it — later code can read req.user
        next();
    } catch (err) {
        next(new ApiError(401, 'Not authorized, invalid token'));
    }
};
module.exports = protect;