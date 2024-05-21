import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ FirstName: '', LastName: '', Email: '', ContactNumber: '', Address: '', Status: '', Company: '' });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:3000/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("There was an error fetching the customers!", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post('http://localhost:3000/api/customers', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomers();
      closePanel();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage('This email or company already exists.');
      } else {
        setErrorMessage('There was an error creating the customer.');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`http://localhost:3000/api/customers/${selectedCustomer.CustomerId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomers();
      closePanel();
    } catch (error) {
      setErrorMessage('There was an error updating the customer.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://localhost:3000/api/customers/${customerToDelete.CustomerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomers();
      closeDeleteModal();
    } catch (error) {
      console.error("There was an error deleting the customer!", error);
    }
  };

  const openPanel = (customer = null) => {
    setErrorMessage('');
    if (customer) {
      setIsUpdateMode(true);
      setSelectedCustomer(customer);
      setForm({
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Email: customer.Email,
        ContactNumber: customer.ContactNumber,
        Address: customer.Address,
        Status: customer.Status,
        Company: customer.Company,
      });
    } else {
      setIsUpdateMode(false);
      setForm({ FirstName: '', LastName: '', Email: '', ContactNumber: '', Address: '', Status: '', Company: '' });
    }
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedCustomer(null);
  };

  const openDeleteModal = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.Company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="customers-container">
      <h1>Customers</h1>
      <div className="controls">
        <input 
          type="text" 
          placeholder="Search by company name..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button className="create-button" onClick={() => openPanel()}>Create New Customer</button>
      </div>
      <table className="customers-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Company</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(customer => (
            <tr key={customer.CustomerId}>
              <td>{customer.FirstName}</td>
              <td>{customer.LastName}</td>
              <td>{customer.Email}</td>
              <td>{customer.ContactNumber}</td>
              <td>{customer.Address}</td>
              <td>{customer.Company}</td>
              <td>{customer.Status}</td>
              <td>
                <button className="edit-button" onClick={() => openPanel(customer)}>Edit</button>
                <button className="delete-button" onClick={() => openDeleteModal(customer)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPanelOpen && (
        <div className="panel">
          <div className="panel-content">
            <span className="close-btn" onClick={closePanel}>&times;</span>
            <h2>{isUpdateMode ? 'Update Customer' : 'Create New Customer'}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form>
              <input type="text" name="FirstName" placeholder="First Name" value={form.FirstName} onChange={handleChange} />
              <input type="text" name="LastName" placeholder="Last Name" value={form.LastName} onChange={handleChange} />
              <input type="email" name="Email" placeholder="Email" value={form.Email} onChange={handleChange} />
              <input type="text" name="ContactNumber" placeholder="Contact Number" value={form.ContactNumber} onChange={handleChange} />
              <input type="text" name="Address" placeholder="Address" value={form.Address} onChange={handleChange} />
              <input type="text" name="Status" placeholder="Status" value={form.Status} onChange={handleChange} />
              <input type="text" name="Company" placeholder="Company" value={form.Company} onChange={handleChange} />
            </form>
            <button className="save-button" onClick={isUpdateMode ? handleUpdate : handleCreate}>
              {isUpdateMode ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p>Are you sure you want to delete this customer?</p>
            <button className="confirm-button" onClick={handleDelete}>Yes</button>
            <button className="cancel-button" onClick={closeDeleteModal}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
