const jwt = require("jsonwebtoken");
const poolPromise = require('../config/db'); // Make sure this path matches your configuration

/**
 * Middleware to verify token and attach user to request
 */
module.exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided." });
        }

        const token = authHeader.split(' ')[1];  // Get token from header
        const decoded = jwt.verify(token, process.env.TOKEN_KEY); // Verify token

        // Fetch user from database
        const pool = await poolPromise;
        const [users] = await pool.query('SELECT * FROM Users WHERE UserId = ?', [decoded.id]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Unauthorized: User not found." });
        }

        // Attach user to request
        req.user = users[0];
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized: Invalid token." });
        }
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
