import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import './Appointments.css';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ CustomerId: '', AppointmentDate: '', Purpose: '', Status: '', UserId: '' });
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);

    useEffect(() => {
        fetchCustomersAndAppointments();
        fetchUsers();
    }, []);

    const fetchCustomersAndAppointments = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const [customerResponse, appointmentResponse] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/customers`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/appointments`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const customersData = customerResponse.data;
            setCustomers(customersData);

            const appointmentsWithCompany = appointmentResponse.data.map(appointment => {
                const customer = customersData.find(c => c.CustomerId === appointment.CustomerId);
                return { 
                    ...appointment, 
                    Company: customer ? customer.Company : 'Unknown', 
                    AppointmentDate: moment.tz(appointment.AppointmentDate, 'UTC').tz('Europe/Istanbul').format('DD-MM-YYYY HH:mm')
                };
            });
            setAppointments(appointmentsWithCompany);
        } catch (error) {
            console.error("There was an error fetching the customers and appointments!", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Users fetched:", response.data); // Log the users
            setUsers(response.data);
        } catch (error) {
            console.error("There was an error fetching the users!", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        const appointmentData = {
            CustomerId: form.CustomerId,
            UserId: form.UserId,
            AppointmentDate: form.AppointmentDate,
            Purpose: form.Purpose,
            Status: form.Status
        };

        try {
            const token = localStorage.getItem('userToken');
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/appointments`, appointmentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCustomersAndAppointments();
            closePanel();
        } catch (error) {
            console.error('There was an error creating the appointment:', error);
            setErrorMessage('Failed to create appointment. Please check the input fields.');
        }
    };

    const handleUpdate = async () => {
        const appointmentData = {
            AppointmentDate: form.AppointmentDate,
            Purpose: form.Purpose,
            Status: form.Status,
            UserId: form.UserId
        };

        try {
            const token = localStorage.getItem('userToken');
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/appointments/${selectedAppointment.AppointmentId}`, appointmentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCustomersAndAppointments();
            closePanel();
        } catch (error) {
            console.error('There was an error updating the appointment.', error);
            setErrorMessage('Failed to update appointment. Please check the input fields.');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/appointments/${appointmentToDelete.AppointmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCustomersAndAppointments();
            setShowDeleteModal(false);
            setAppointmentToDelete(null);
        } catch (error) {
            console.error("There was an error deleting the appointment!", error);
        }
    };

    const openPanel = (appointment = null) => {
        setErrorMessage('');
        if (appointment) {
            setIsUpdateMode(true);
            setSelectedAppointment(appointment);
            setForm({
                CustomerId: appointment.CustomerId,
                AppointmentDate: moment.tz(appointment.AppointmentDate, 'UTC').tz('Europe/Istanbul').format('YYYY-MM-DDTHH:mm'),
                Purpose: appointment.Purpose,
                Status: appointment.Status,
                UserId: appointment.UserId
            });
        } else {
            setIsUpdateMode(false);
            setForm({ CustomerId: '', AppointmentDate: '', Purpose: '', Status: '', UserId: '' });
        }
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setSelectedAppointment(null);
    };

    const filteredAppointments = appointments.filter(appointment =>
        appointment.Company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="appointments-container">
            <h1>Appointments</h1>
            <div className="controls">
                <input 
                    type="text" 
                    placeholder="Search by company name..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <button className="create-button" onClick={() => openPanel()}>Create New Appointment</button>
            </div>
            <table className="appointments-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Purpose</th>
                        <th>Appointment Date</th>
                        <th>Status</th>
                        <th>User</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAppointments.map(appointment => (
                        <tr key={appointment.AppointmentId}>
                            <td>{appointment.Company}</td>
                            <td>{appointment.Purpose}</td>
                            <td>{appointment.AppointmentDate}</td>
                            <td>{appointment.Status}</td>
                            <td>{users.find(user => user.UserId === appointment.UserId)?.FirstName + ' ' + users.find(user => user.UserId === appointment.UserId)?.LastName || 'Unknown'}</td>
                            <td>
                                <button className="edit-button" onClick={() => openPanel(appointment)}>Edit</button>
                                <button className="delete-button" onClick={() => { setShowDeleteModal(true); setAppointmentToDelete(appointment); }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isPanelOpen && (
                <div className="panel">
                    <div className="panel-content">
                        <span className="close-btn" onClick={closePanel}>&times;</span>
                        <h2>{isUpdateMode ? 'Update Appointment' : 'Create New Appointment'}</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <form>
                            <select name="CustomerId" value={form.CustomerId} onChange={handleChange}>
                                <option value="">Select Company</option>
                                {customers.map(customer => (
                                    <option key={customer.CustomerId} value={customer.CustomerId}>
                                        {customer.Company}
                                    </option>
                                ))}
                            </select>
                            <input type="datetime-local" name="AppointmentDate" value={form.AppointmentDate} onChange={handleChange} />
                            <input type="text" name="Purpose" placeholder="Purpose" value={form.Purpose} onChange={handleChange} />
                            <input type="text" name="Status" placeholder="Status" value={form.Status} onChange={handleChange} />
                            <select name="UserId" value={form.UserId} onChange={handleChange}>
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user.UserId} value={user.UserId}>
                                        {user.FirstName} {user.LastName}
                                    </option>
                                ))}
                            </select>
                        </form>
                        <button className="save-button" onClick={isUpdateMode ? handleUpdate : handleCreate}>
                            {isUpdateMode ? 'Update Appointment' : 'Create Appointment'}
                        </button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="delete-modal">
                    <div className="delete-modal-content">
                        <p>Are you sure you want to delete this appointment?</p>
                        <button className="confirm-button" onClick={handleDelete}>Yes</button>
                        <button className="cancel-button" onClick={() => { setShowDeleteModal(false); setAppointmentToDelete(null); }}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
