//this is the main routing file we call every sub router here

const { Router } = require('express');
const authRoutes = require('./auth.routes');
const cvRoutes = require('./cv.routes');
const AiRoutes = require('./ai.routes');
const router = Router();
router.use('/auth', authRoutes); // -> /api/auth/login, /api/auth/signup
router.use('/cv',cvRoutes);
router.use('/Ai',AiRoutes);
module.exports = router;