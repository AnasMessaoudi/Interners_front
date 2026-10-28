const { Router } = require('express');
const { handleLogin,handleSignup,me,handleGetAll } = require('../controllers/auth.controller');
const protect = require("../middleware/auth.js");

const router = Router();

router.post('/login', handleLogin);
router.post('/signup', handleSignup);
router.get('/me',protect,me);
router.get('/getAll',handleGetAll);
module.exports = router;