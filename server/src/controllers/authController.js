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
        const result = await pool.query('INSERT INTO Users (Email, Password, FirstName, LastName, Username) VALUES (?, ?, ?, ?, ?)',
                         [req.body.email, hashedPassword, req.body.FirstName, req.body.LastName, req.body.username]); 
        const userId = result[0].insertId;
        const token = createToken(userId); // Generate token after successful signup

        console.log(token);

        res.status(201).json({ message: "User signed up successfully", token: token, UserId: userId });
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

        const token = createToken(user.UserId); // Generate token after successful login
        
        console.log(token);

        res.json({ message: "Login successful", token: token, UserId: user.UserId });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: "Internal Server Error", error: err.toString() });
    }
};
