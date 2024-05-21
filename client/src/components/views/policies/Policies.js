import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Policies.css';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({ CustomerId: '', Type: '', PolicyNumber: '', StartDate: '', EndDate: '', PremiumAmount: '' });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);

  useEffect(() => {
    fetchPolicies();
    fetchCompanies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:3000/api/policies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPolicies(response.data);
    } catch (error) {
      console.error("There was an error fetching the policies!", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:3000/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(response.data);
    } catch (error) {
      console.error("There was an error fetching the companies!", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post('http://localhost:3000/api/policies', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPolicies();
      closePanel();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage('This policy number already exists.');
      } else {
        setErrorMessage('There was an error creating the policy.');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`http://localhost:3000/api/policies/${selectedPolicy.PolicyId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPolicies();
      closePanel();
    } catch (error) {
      setErrorMessage('There was an error updating the policy.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://localhost:3000/api/policies/${policyToDelete.PolicyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPolicies();
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("There was an error deleting the policy!", error);
    }
  };

  const openPanel = (policy = null) => {
    setErrorMessage('');
    if (policy) {
      setIsUpdateMode(true);
      setSelectedPolicy(policy);
      setForm({
        CustomerId: policy.CustomerId,
        Type: policy.Type,
        PolicyNumber: policy.PolicyNumber,
        StartDate: policy.StartDate,
        EndDate: policy.EndDate,
        PremiumAmount: policy.PremiumAmount,
      });
    } else {
      setIsUpdateMode(false);
      setForm({ CustomerId: '', Type: '', PolicyNumber: '', StartDate: '', EndDate: '', PremiumAmount: '' });
    }
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedPolicy(null);
  };

  const openDeleteConfirm = (policy) => {
    setPolicyToDelete(policy);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setPolicyToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  const filteredPolicies = policies.filter(policy => 
    companies.find(company => company.CustomerId === policy.CustomerId)?.Company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="policies-container">
      <h1>Policies</h1>
      <div className="controls">
        <input 
          type="text" 
          placeholder="Search by company name..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button className="create-button" onClick={() => openPanel()}>Create New Policy</button>
      </div>
      <table className="policies-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Type</th>
            <th>Policy Number</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Premium Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPolicies.map(policy => {
            const company = companies.find(company => company.CustomerId === policy.CustomerId);
            return (
              <tr key={policy.PolicyId}>
                <td>{company?.Company || 'N/A'}</td>
                <td>{policy.Type}</td>
                <td>{policy.PolicyNumber}</td>
                <td>{policy.StartDate}</td>
                <td>{policy.EndDate}</td>
                <td>{policy.PremiumAmount}</td>
                <td>
                  <button className="edit-button" onClick={() => openPanel(policy)}>Edit</button>
                  <button className="delete-button" onClick={() => openDeleteConfirm(policy)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isPanelOpen && (
        <div className="panel">
          <div className="panel-content">
            <span className="close-btn" onClick={closePanel}>&times;</span>
            <h2>{isUpdateMode ? 'Update Policy' : 'Create New Policy'}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form>
              <select name="CustomerId" value={form.CustomerId} onChange={handleChange}>
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.CustomerId} value={company.CustomerId}>{company.Company}</option>
                ))}
              </select>
              <input type="text" name="Type" placeholder="Type" value={form.Type} onChange={handleChange} />
              <input type="text" name="PolicyNumber" placeholder="Policy Number" value={form.PolicyNumber} onChange={handleChange} />
              <input type="date" name="StartDate" placeholder="Start Date" value={form.StartDate} onChange={handleChange} />
              <input type="date" name="EndDate" placeholder="End Date" value={form.EndDate} onChange={handleChange} />
              <input type="number" name="PremiumAmount" placeholder="Premium Amount" value={form.PremiumAmount} onChange={handleChange} />
            </form>
            <button className="save-button" onClick={isUpdateMode ? handleUpdate : handleCreate}>
              {isUpdateMode ? 'Update Policy' : 'Create Policy'}
            </button>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-box">
            <p>Are you sure you want to delete this policy?</p>
            <button className="confirm-button" onClick={handleDelete}>Yes</button>
            <button className="cancel-button" onClick={closeDeleteConfirm}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Policies;
