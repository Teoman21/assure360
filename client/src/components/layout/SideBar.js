import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <button onClick={() => navigateTo('/dashboard')}>Dashboard</button>
      <button onClick={() => navigateTo('/dashboard/customers')}>Customers</button>
      <button onClick={() => navigateTo('/dashboard/policies')}>Policies</button>
      <button onClick={() => navigateTo('/dashboard/appointments')}>Appointments</button>
      <button onClick={() => navigateTo('/dashboard/interactions')}>Interactions</button>
      <button onClick={() => navigateTo('/dashboard/claims')}>Claims</button>
      <button onClick={() => navigateTo('/dashboard/settings')}>Settings</button>
    </div>
  );
};

export default Sidebar;
