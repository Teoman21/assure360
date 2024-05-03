require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports.createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: 20 * 24 * 60 * 60,
    });
};