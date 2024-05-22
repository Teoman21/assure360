import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Claims.css';

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [form, setForm] = useState({ PolicyId: '', DateFiled: '', ClaimAmount: '', Status: '', ResolutionDate: '' });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [policies, setPolicies] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState(null);

  useEffect(() => {
    fetchClaims();
    fetchPolicies();
  }, []);

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:3000/api/claims', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClaims(response.data);
    } catch (error) {
      console.error("There was an error fetching the claims!", error);
    }
  };

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post('http://localhost:3000/api/claims', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClaims();
      closePanel();
    } catch (error) {
      setErrorMessage('There was an error creating the claim.');
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`http://localhost:3000/api/claims/${selectedClaim.ClaimId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClaims();
      closePanel();
    } catch (error) {
      setErrorMessage('There was an error updating the claim.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://localhost:3000/api/claims/${claimToDelete.ClaimId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClaims();
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("There was an error deleting the claim!", error);
    }
  };

  const openPanel = (claim = null) => {
    setErrorMessage('');
    if (claim) {
      setIsUpdateMode(true);
      setSelectedClaim(claim);
      setForm({
        PolicyId: claim.PolicyId,
        DateFiled: claim.DateFiled,
        ClaimAmount: claim.ClaimAmount,
        Status: claim.Status,
        ResolutionDate: claim.ResolutionDate,
      });
    } else {
      setIsUpdateMode(false);
      setForm({ PolicyId: '', DateFiled: '', ClaimAmount: '', Status: '', ResolutionDate: '' });
    }
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedClaim(null);
  };

  const openDeleteConfirm = (claim) => {
    setClaimToDelete(claim);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setClaimToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  const filteredClaims = claims.filter(claim => 
    policies.find(policy => policy.PolicyId === claim.PolicyId)?.Company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="claims-container">
      <h1>Claims</h1>
      <div className="controls">
        <input 
          type="text" 
          placeholder="Search by company name..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button className="create-button" onClick={() => openPanel()}>Create New Claim</button>
      </div>
      <table className="claims-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Policy Number</th>
            <th>Date Filed</th>
            <th>Claim Amount</th>
            <th>Status</th>
            <th>Resolution Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClaims.map(claim => {
            const policy = policies.find(policy => policy.PolicyId === claim.PolicyId);
            return (
              <tr key={claim.ClaimId}>
                <td>{policy?.Company || 'N/A'}</td>
                <td>{policy?.PolicyNumber || 'N/A'}</td>
                <td>{claim.DateFiled}</td>
                <td>{claim.ClaimAmount}</td>
                <td>{claim.Status}</td>
                <td>{claim.ResolutionDate}</td>
                <td>
                  <button className="edit-button" onClick={() => openPanel(claim)}>Edit</button>
                  <button className="delete-button" onClick={() => openDeleteConfirm(claim)}>Delete</button>
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
            <h2>{isUpdateMode ? 'Update Claim' : 'Create New Claim'}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form>
              <select name="PolicyId" value={form.PolicyId} onChange={handleChange}>
                <option value="">Select Policy</option>
                {policies.map(policy => (
                  <option key={policy.PolicyId} value={policy.PolicyId}>{policy.PolicyNumber} ({policy.Company})</option>
                ))}
              </select>
              <input type="date" name="DateFiled" placeholder="Date Filed" value={form.DateFiled} onChange={handleChange} />
              <input type="number" name="ClaimAmount" placeholder="Claim Amount" value={form.ClaimAmount} onChange={handleChange} />
              <input type="text" name="Status" placeholder="Status" value={form.Status} onChange={handleChange} />
              <input type="date" name="ResolutionDate" placeholder="Resolution Date" value={form.ResolutionDate} onChange={handleChange} />
            </form>
            <button className="save-button" onClick={isUpdateMode ? handleUpdate : handleCreate}>
              {isUpdateMode ? 'Update Claim' : 'Create Claim'}
            </button>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="delete-confirm">
          <div className="delete-confirm-content">
            <p>Are you sure you want to delete this claim?</p>
            <button className="yes-button" onClick={handleDelete}>Yes</button>
            <button className="no-button" onClick={closeDeleteConfirm}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Claims;
