// userController.js
const pool = require('../config/db.js'); 

const getUsers = (req, res) => {
    pool.query('SELECT * FROM Users', (err, results) => {
        if (err) {
            console.error("Error fetching users: ", err.message);
            res.status(500).send('Error fetching users');
            return;
        }
        res.json(results);
    });
};

module.exports = {
    getUsers
};
