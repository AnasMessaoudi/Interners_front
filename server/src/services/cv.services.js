const userModel = require('../Models/User');
const { validateCv } = require('../validators/cv.validator');

const saveCv = async (userId, fileName, extractedText) => {
    validateCv(fileName, extractedText);

    await userModel.findByIdAndUpdate(userId, {
        cv: {
            fileName: fileName.trim().slice(0, 200),
            fileUrl: null,                       // no file storage yet
            extractedText: extractedText.trim(),
            uploadedAt: new Date(),
        },
    });
};

module.exports = { saveCv };