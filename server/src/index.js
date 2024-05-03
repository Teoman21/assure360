// index.js
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./config/db.js'); 

//Import tables here
const userRoutes = require('./routes/userRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Verify database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database: ", err.message);
        return;
    }
    console.log("Connected to MySQL database");
    connection.release(); 
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

app.use('/', userRoutes);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
