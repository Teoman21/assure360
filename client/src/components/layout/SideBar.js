import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsOpen(false); // Close the sidebar after navigation
  };

  return (
    <>
      <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button onClick={() => navigateTo('/dashboard')}>Dashboard</button>
        <button onClick={() => navigateTo('/dashboard/customers')}>Customers</button>
        <button onClick={() => navigateTo('/dashboard/policies')}>Policies</button>
        <button onClick={() => navigateTo('/dashboard/appointments')}>Appointments</button>
        <button onClick={() => navigateTo('/dashboard/interactions')}>Interactions</button>
        <button onClick={() => navigateTo('/dashboard/claims')}>Claims</button>
      </div>
    </>
  );
};

export default Sidebar;
