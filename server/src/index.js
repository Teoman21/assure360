// index.js
const express = require('express');
const bodyParser = require('body-parser');
//IMPORT THE NECESSERY PATHS
const poolPromise = require('./config/db.js'); 
const authRoute = require("./routes/authRoute.js");
const customerRoute = require("./routes/customerRouter.js");
const { verifyToken } = require('./middlewares/verifyToken.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

// Ensure the database is connected before starting the server
async function startServer() {
    try {
        const pool = await poolPromise; // Ensure the pool is ready
        const connection = await pool.getConnection();
        console.log("Connected to MySQL database");
        connection.release(); // Release the connection back to the pool

        app.use('/auth', authRoute);
        app.use('/api', verifyToken);
        app.use('/api/customers',customerRoute);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to the database: ", err.message);
        process.exit(1); // Exit if we cannot connect to the database
    }
}

startServer();
