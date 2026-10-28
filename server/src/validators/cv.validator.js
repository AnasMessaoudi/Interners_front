const ApiError = require('../Utils/ApiError');

const validateCv = (fileName,extractedText)=>{
    if (typeof fileName !== 'string' || typeof extractedText !== 'string') {
        throw new ApiError(400, 'File name and text are required');
    }
    if (extractedText.trim().length < 100) {
        throw new ApiError(400, 'Could not read text from this PDF. Upload a text-based PDF, not a scan.');
    }
    if (extractedText.length > 50000) {
        throw new ApiError(400, 'This CV is too long');
    }
};
module.exports = {validateCv};