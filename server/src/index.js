require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection pool setup
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // Make sure to specify the port here
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verify database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database: " , err.message);
        return;
    }
    console.log("Connected to MySQL database ");
    connection.release(); // Always release connections back to the pool
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Testing server with .env');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
