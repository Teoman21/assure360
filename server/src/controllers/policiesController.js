const db = require('../config/db');

// Get all policies with customer and company details
exports.getAllPolicies = async (req, res) => {
    try {
        const [policies] = await db.execute(`
            SELECT p.*, c.FirstName, c.LastName, c.Company
            FROM Policies p
            JOIN Customers c ON p.CustomerId = c.CustomerId
        `);
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single policy by ID including company
exports.getPolicyById = async (req, res) => {
    try {
        const [policy] = await db.execute(`
            SELECT p.*, c.FirstName, c.LastName, c.Company
            FROM Policies p
            JOIN Customers c ON p.CustomerId = c.CustomerId
            WHERE p.PolicyId = ?
        `, [req.params.id]);
        if (policy.length > 0) {
            res.status(200).json(policy[0]);
        } else {
            res.status(404).json({ message: 'Policy not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new policy
exports.createPolicy = async (req, res) => {
    const { CustomerId, Type, PolicyNumber, StartDate, EndDate, PremiumAmount } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO Policies (CustomerId, Type, PolicyNumber, StartDate, EndDate, PremiumAmount)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [CustomerId, Type, PolicyNumber, StartDate, EndDate, PremiumAmount]);
        res.status(201).json({ message: 'Policy created', PolicyId: result.insertId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a policy
exports.updatePolicy = async (req, res) => {
    const { Type, PolicyNumber, StartDate, EndDate, PremiumAmount } = req.body;
    try {
        await db.execute(`
            UPDATE Policies
            SET Type = ?, PolicyNumber = ?, StartDate = ?, EndDate = ?, PremiumAmount = ?
            WHERE PolicyId = ?`,
            [Type, PolicyNumber, StartDate, EndDate, PremiumAmount, req.params.id]);
        res.status(200).json({ message: 'Policy updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a policy
exports.deletePolicy = async (req, res) => {
    try {
        await db.execute('DELETE FROM Policies WHERE PolicyId = ?', [req.params.id]);
        res.status(200).json({ message: 'Policy deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
