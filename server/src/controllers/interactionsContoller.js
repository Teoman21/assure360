const db = require('../config/db');

// Get all interactions
exports.getAllInteractions = async (req, res) => {
    try {
        const [interactions] = await db.execute(`
            SELECT i.*, c.FirstName, c.LastName, c.Company
            FROM Interactions i
            JOIN Customers c ON i.CustomerId = c.CustomerId
        `);
        res.status(200).json(interactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single interaction by ID
exports.getInteractionById = async (req, res) => {
    try {
        const [interaction] = await db.execute(`
            SELECT i.*, c.FirstName, c.LastName, c.Company
            FROM Interactions i
            JOIN Customers c ON i.CustomerId = c.CustomerId
            WHERE i.InteractionId = ?
        `, [req.params.id]);
        if (interaction.length > 0) {
            res.status(200).json(interaction[0]);
        } else {
            res.status(404).json({ message: 'Interaction not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new interaction
exports.createInteraction = async (req, res) => {
    const { CustomerId, UserId, Type, Content, InteractionDate } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO Interactions (CustomerId, UserId, Type, Content, InteractionDate)
            VALUES (?, ?, ?, ?, ?)`,
            [CustomerId, UserId, Type, Content, InteractionDate]);
        res.status(201).json({ message: 'Interaction created', InteractionId: result.insertId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an interaction
exports.updateInteraction = async (req, res) => {
    const { Type, Content, InteractionDate } = req.body;
    try {
        await db.execute(`
            UPDATE Interactions
            SET Type = ?, Content = ?, InteractionDate = ?
            WHERE InteractionId = ?`,
            [Type, Content, InteractionDate, req.params.id]);
        res.status(200).json({ message: 'Interaction updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an interaction
exports.deleteInteraction = async (req, res) => {
    try {
        await db.execute('DELETE FROM Interactions WHERE InteractionId = ?', [req.params.id]);
        res.status(200).json({ message: 'Interaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};