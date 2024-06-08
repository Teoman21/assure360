const db = require('../config/db');

exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.execute(`SELECT * FROM Users`);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// deleteUser function
// userController.js
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM Users WHERE UserId = ?', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUserRole = async (req, res) => {
    const userId = req.user.UserId;
    try {
        const [rows] = await db.execute('SELECT Role FROM Users WHERE UserId = ?', [userId]);
        if (rows.length > 0) {
            res.status(200).json({ role: rows[0].Role });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

