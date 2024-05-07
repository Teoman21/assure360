// controllers/authController.js
const poolPromise = require('../config/db'); 
const { createToken } = require("../utils/tokenCreate")
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const pool = await poolPromise; // Wait for the pool promise to resolve
        const [users] = await pool.query('SELECT UserId FROM Users WHERE Email = ?', [req.body.email]);
        if (users.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query('INSERT INTO Users (Email, Password, FirstName, LastName, Username) VALUES (?, ?, ?, ?, ?)',
                         [req.body.email, hashedPassword, req.body.fullName, req.body.fullName, req.body.username]); // Assuming splitting fullName if needed

        res.status(201).json({ message: "User signed up successfully" });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: "Internal Server Error", error: err.toString() });
    }
};

exports.login = async (req, res) => {
    try {
        const pool = await poolPromise;
        const [users] = await pool.query('SELECT UserId, Password FROM Users WHERE Email = ?', [req.body.email]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = users[0];
        if (!await bcrypt.compare(req.body.password, user.Password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful" }); // Assume token handling elsewhere
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: "Internal Server Error", error: err.toString() });
    }
};
