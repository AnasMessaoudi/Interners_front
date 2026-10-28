const { saveCv } = require('../services/cv.services');

const handleSaveCv = async (req, res, next) => {
    try {
        const { fileName, extractedText } = req.body;
        await saveCv(req.user._id, fileName, extractedText);
        res.status(200).json({ message: 'CV saved', hasCv: true });
    } catch (err) {
        next(err);
    }
};

module.exports = { handleSaveCv };