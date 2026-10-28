
const { AskAi,CvScore } = require("../services/ai.services");

const HandleAskAi = async (req, res, next) => {
    try {
        const { prompt } = req.body;

        if (typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({
                message: "A valid prompt is required.",
            });
        }

        const response = await AskAi(prompt.trim());

        return res.status(200).json({ response });
    } catch (error) {
        next(error);
    }
};
const HandleCompareToMyCv = async(req,res,next)=>{
    try{
        const jobDesc = req.body.words;
        const response = await CvScore(req.user._id,jobDesc);
        return res.status(200).json({response});
    }catch(error){
        next(error);
    }
}

module.exports = { HandleAskAi, HandleCompareToMyCv};
