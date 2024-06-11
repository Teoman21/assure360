import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import './Settings.css';

const Settings = () => {
    const { logoutContext, userId, userToken } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', username: '', firstName: '', lastName: '', role: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchUsers();
        checkIfAdmin();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            const filteredUsers = response.data.filter(user => user.UserId !== parseInt(userId));
            setUsers(filteredUsers);
        } catch (error) {
            console.error("There was an error fetching the users!", error);
        }
    };

    const checkIfAdmin = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            if (response.data.role === 'Admin') {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error("There was an error checking the user role!", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, form, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            fetchUsers();
            closePanel();
        } catch (error) {
            console.error('There was an error creating the user:', error);
            setErrorMessage('Failed to create user. Please check the input fields.');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userToDelete.UserId}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            fetchUsers();
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("There was an error deleting the user!", error);
        }
    };

    const openPanel = () => {
        setErrorMessage('');
        setForm({ email: '', password: '', username: '', firstName: '', lastName: '', role: '' });
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="controls">
                {isAdmin && <button className="create-button" onClick={openPanel}>Create New User</button>}
                <button className="logout-button" onClick={logoutContext}>Logout</button>
            </div>
            <h2>User List</h2>
            <table className="settings-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.UserId}>
                            <td>{user.Username}</td>
                            <td>{user.Email}</td>
                            <td>{user.FirstName}</td>
                            <td>{user.LastName}</td>
                            <td>{user.Role}</td>
                            {isAdmin && (
                                <td>
                                    <button className="delete-button" onClick={() => { setShowDeleteModal(true); setUserToDelete(user); }}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {isPanelOpen && (
                <div className="panel">
                    <div className="panel-content">
                        <span className="close-btn" onClick={closePanel}>&times;</span>
                        <h2>Create New User</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <form>
                            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
                            <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                            <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
                            <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
                            <select name="role" value={form.role} onChange={handleChange}>
                                <option value="">Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Agent">Agent</option>
                                <option value="Support">Support</option>
                            </select>
                        </form>
                        <button className="save-button" onClick={handleCreate}>Create User</button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="delete-modal">
                    <div className="delete-modal-content">
                        <p>Are you sure you want to delete this user?</p>
                        <button className="confirm-button" onClick={handleDeleteUser}>Yes</button>
                        <button className="cancel-button" onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
