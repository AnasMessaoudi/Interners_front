
const OpenAI = require("openai");
require("dotenv").config();

if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing from .env");
}

const ai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const Model = process.env.GROQ_MODEL|| "openai/gpt-oss-20b";

module.exports = { ai, Model };
