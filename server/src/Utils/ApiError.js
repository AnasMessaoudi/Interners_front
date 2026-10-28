//class bch na3tou bih status code lel errors 
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ApiError;