const { Router } = require('express');
const {handleSaveCv} = require('../controllers/cv.controller');
const protect = require('../middleware/auth');

const router = Router();

router.post('/',protect,handleSaveCv);
module.exports = router;