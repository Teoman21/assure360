const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const poolPromise = require('./config/db.js'); 
const authRoute = require("./routes/authRoute.js");
const customerRoute = require("./routes/customerRouter.js");
const policiesRoute = require('./routes/policiesRouter');
const claimsRoute = require("./routes/claimsRoute.js");
const appointmentRoute = require("./routes/appointmentsRoute.js");
const interactionRoute = require("./routes/interactionsRoute.js");
const userRoute = require("./routes/userRoute.js");
const { verifyToken } = require('./middlewares/verifyToken.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

async function startServer() {
    try {
        const pool = await poolPromise;
        const connection = await pool.getConnection();
        console.log("Connected to MySQL database");
        connection.release();

        app.use('/auth', authRoute);

        app.use('/api', verifyToken);
        app.use('/api/customers', customerRoute);
        app.use('/api/policies', policiesRoute);
        app.use('/api/claims', claimsRoute);
        app.use('/api/appointments', appointmentRoute);
        app.use('/api/interactions', interactionRoute);
        app.use('/api/users', userRoute);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to the database: ", err.message);
        process.exit(1);
    }
}

startServer();
