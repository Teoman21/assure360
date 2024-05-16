const db = require('../config/db');

// Get all claims with policy and company details
exports.getAllClaims = async (req, res) => {
    try {
        const [claims] = await db.execute(`
            SELECT cl.*, p.PolicyNumber, c.FirstName, c.LastName, c.Company
            FROM Claims cl
            JOIN Policies p ON cl.PolicyId = p.PolicyId
            JOIN Customers c ON p.CustomerId = c.CustomerId
        `);
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single claim by ID including company
exports.getClaimById = async (req, res) => {
    try {
        const [claim] = await db.execute(`
            SELECT cl.*, p.PolicyNumber, c.FirstName, c.LastName, c.Company
            FROM Claims cl
            JOIN Policies p ON cl.PolicyId = p.PolicyId
            JOIN Customers c ON p.CustomerId = c.CustomerId
            WHERE cl.ClaimId = ?
        `, [req.params.id]);
        if (claim.length > 0) {
            res.status(200).json(claim[0]);
        } else {
            res.status(404).json({ message: 'Claim not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new claim
exports.createClaim = async (req, res) => {
    const { PolicyId, DateFiled, ClaimAmount, Status, ResolutionDate } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO Claims (PolicyId, DateFiled, ClaimAmount, Status, ResolutionDate)
            VALUES (?, ?, ?, ?, ?)`,
            [PolicyId, DateFiled, ClaimAmount, Status, ResolutionDate]);
        res.status(201).json({ message: 'Claim created', ClaimId: result.insertId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a claim
exports.updateClaim = async (req, res) => {
    const { DateFiled, ClaimAmount, Status, ResolutionDate } = req.body;
    try {
        await db.execute(`
            UPDATE Claims
            SET DateFiled = ?, ClaimAmount = ?, Status = ?, ResolutionDate = ?
            WHERE ClaimId = ?`,
            [DateFiled, ClaimAmount, Status, ResolutionDate, req.params.id]);
        res.status(200).json({ message: 'Claim updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a claim
exports.deleteClaim = async (req, res) => {
    try {
        await db.execute('DELETE FROM Claims WHERE ClaimId = ?', [req.params.id]);
        res.status(200).json({ message: 'Claim deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
