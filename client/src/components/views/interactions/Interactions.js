import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import '../appointments/Appointments.css'; // Assuming you want to use the same styling

const Interactions = () => {
    const [interactions, setInteractions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ CustomerId: '', InteractionDate: '', Type: '', Content: '', UserId: '' });
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [selectedInteraction, setSelectedInteraction] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [interactionToDelete, setInteractionToDelete] = useState(null);

    useEffect(() => {
        fetchCustomersAndInteractions();
        fetchUsers();
    }, []);

    const fetchCustomersAndInteractions = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const [customerResponse, interactionResponse] = await Promise.all([
                axios.get('http://localhost:3000/api/customers', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:3000/api/interactions', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const customersData = customerResponse.data;
            setCustomers(customersData);

            const interactionsWithCompany = interactionResponse.data.map(interaction => {
                const customer = customersData.find(c => c.CustomerId === interaction.CustomerId);
                return {
                    ...interaction,
                    Company: customer ? customer.Company : 'Unknown',
                    InteractionDate: moment.tz(interaction.InteractionDate, 'UTC').tz('Europe/Istanbul').format('DD-MM-YYYY HH:mm')
                };
            });
            setInteractions(interactionsWithCompany);
        } catch (error) {
            console.error("There was an error fetching the customers and interactions!", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get('http://localhost:3000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("There was an error fetching the users!", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        const interactionData = {
            CustomerId: form.CustomerId,
            InteractionDate: form.InteractionDate,
            Type: form.Type,
            Content: form.Content,
            UserId: form.UserId
        };

        try {
            const token = localStorage.getItem('userToken');
            await axios.post('http://localhost:3000/api/interactions', interactionData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCustomersAndInteractions();
            closePanel();
        } catch (error) {
            console.error('There was an error creating the interaction:', error);
            setErrorMessage('Failed to create interaction. Please check the input fields.');
        }
    };

    const handleUpdate = async () => {
        const interactionData = {
            InteractionDate: form.InteractionDate,
            Type: form.Type,
            Content: form.Content,
            UserId: form.UserId
        };

        try {
            const token = localStorage.getItem('userToken');
            await axios.put(`http://localhost:3000/api/interactions/${selectedInteraction.InteractionId}`, interactionData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCustomersAndInteractions();
            closePanel();
        } catch (error) {
            console.error('There was an error updating the interaction.', error);
            setErrorMessage('Failed to update interaction. Please check the input fields.');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`http://localhost:3000/api/interactions/${interactionToDelete.InteractionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCustomersAndInteractions();
            setShowDeleteModal(false);
            setInteractionToDelete(null);
        } catch (error) {
            console.error("There was an error deleting the interaction!", error);
        }
    };

    const openPanel = (interaction = null) => {
        setErrorMessage('');
        if (interaction) {
            setIsUpdateMode(true);
            setSelectedInteraction(interaction);
            setForm({
                CustomerId: interaction.CustomerId,
                InteractionDate: moment.tz(interaction.InteractionDate, 'UTC').tz('Europe/Istanbul').format('YYYY-MM-DDTHH:mm'),
                Type: interaction.Type,
                Content: interaction.Content,
                UserId: interaction.UserId
            });
        } else {
            setIsUpdateMode(false);
            setForm({ CustomerId: '', InteractionDate: '', Type: '', Content: '', UserId: '' });
        }
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setSelectedInteraction(null);
    };

    const filteredInteractions = interactions.filter(interaction =>
        interaction.Company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="appointments-container">
            <h1>Interactions</h1>
            <div className="controls">
                <input 
                    type="text" 
                    placeholder="Search by company name..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <button className="create-button" onClick={() => openPanel()}>Create New Interaction</button>
            </div>
            <table className="appointments-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Interaction Date</th>
                        <th>Content</th>
                        <th>User</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInteractions.map(interaction => (
                        <tr key={interaction.InteractionId}>
                            <td>{interaction.Company}</td>
                            <td>{interaction.Type}</td>
                            <td>{interaction.InteractionDate}</td>
                            <td>{interaction.Content}</td>
                            <td>{users.find(user => user.UserId === interaction.UserId)?.FirstName + ' ' + users.find(user => user.UserId === interaction.UserId)?.LastName || 'Unknown'}</td>
                            <td>
                                <button className="edit-button" onClick={() => openPanel(interaction)}>Edit</button>
                                <button className="delete-button" onClick={() => { setShowDeleteModal(true); setInteractionToDelete(interaction); }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isPanelOpen && (
                <div className="panel">
                    <div className="panel-content">
                        <span className="close-btn" onClick={closePanel}>&times;</span>
                        <h2>{isUpdateMode ? 'Update Interaction' : 'Create New Interaction'}</h2>
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
                            <input type="datetime-local" name="InteractionDate" value={form.InteractionDate} onChange={handleChange} />
                            <input type="text" name="Type" placeholder="Type" value={form.Type} onChange={handleChange} />
                            <input type="text" name="Content" placeholder="Content" value={form.Content} onChange={handleChange} />
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
                            {isUpdateMode ? 'Update Interaction' : 'Create Interaction'}
                        </button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="delete-modal">
                    <div className="delete-modal-content">
                        <p>Are you sure you want to delete this interaction?</p>
                        <button className="confirm-button" onClick={handleDelete}>Yes</button>
                        <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Interactions;
