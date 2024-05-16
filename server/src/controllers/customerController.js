const db = require('../config/db');

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const [customers] = await db.execute('SELECT * FROM Customers');
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const [customer] = await db.execute('SELECT * FROM Customers WHERE CustomerId = ?', [req.params.id]);
        if (customer.length > 0) {
            res.status(200).json(customer[0]);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
    const { FirstName, LastName, Email, ContactNumber, Address, Status, Company } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO Customers (FirstName, LastName, Email, ContactNumber, Address, Status, Company)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [FirstName, LastName, Email, ContactNumber, Address, Status, Company]);
        res.status(201).json({ message: 'Customer created', CustomerId: result.insertId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
    const { FirstName, LastName, Email, ContactNumber, Address, Status, Company } = req.body;
    try {
        await db.execute(`
            UPDATE Customers
            SET FirstName = ?, LastName = ?, Email = ?, ContactNumber = ?, Address = ?, Status = ?, Company = ?
            WHERE CustomerId = ?`,
            [FirstName, LastName, Email, ContactNumber, Address, Status, Company, req.params.id]);
        res.status(200).json({ message: 'Customer updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
    try {
        await db.execute('DELETE FROM Customers WHERE CustomerId = ?', [req.params.id]);
        res.status(200).json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
