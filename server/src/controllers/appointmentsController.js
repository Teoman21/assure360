const db = require('../config/db');

// Get all appointments with customer details including company
exports.getAllAppointments = async (req, res) => {
    try {
        const [appointments] = await db.execute(`
            SELECT a.*, c.FirstName, c.LastName, c.Company
            FROM Appointments a
            JOIN Customers c ON a.CustomerId = c.CustomerId
        `);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single appointment by ID including company
exports.getAppointmentById = async (req, res) => {
    try {
        const [appointment] = await db.execute(`
            SELECT a.*, c.FirstName, c.LastName, c.Company
            FROM Appointments a
            JOIN Customers c ON a.CustomerId = c.CustomerId
            WHERE a.AppointmentId = ?
        `, [req.params.id]);
        if (appointment.length > 0) {
            res.status(200).json(appointment[0]);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
    const { CustomerId, UserId, AppointmentDate, Purpose, Status, Company } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO Appointments (CustomerId, UserId, AppointmentDate, Purpose, Status)
            VALUES (?, ?, ?, ?, ?)`,
            [CustomerId, UserId, AppointmentDate, Purpose, Status]);
        res.status(201).json({ message: 'Appointment created', AppointmentId: result.insertId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Update an appointment
exports.updateAppointment = async (req, res) => {
    const { AppointmentDate, Purpose, Status, UserId } = req.body;
    try {
        await db.execute(`
            UPDATE Appointments
            SET AppointmentDate = ?, Purpose = ?, Status = ?, UserId = ?
            WHERE AppointmentId = ?`,
            [AppointmentDate, Purpose, Status, UserId, req.params.id]);
        res.status(200).json({ message: 'Appointment updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
    try {
        await db.execute('DELETE FROM Appointments WHERE AppointmentId = ?', [req.params.id]);
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
