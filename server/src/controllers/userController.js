const db = require('../config/db');

exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.execute(`SELECT * FROM Users`);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
