const { Router } = require('express');
const {HandleAskAi,HandleCompareToMyCv} = require('../controllers/ai.controller');
const protect = require('../middleware/auth');

const router = Router();
router.post("/Ask", HandleAskAi);
router.post("/CompareCv",protect,HandleCompareToMyCv);
module.exports = router