import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', height: '100vh', background: '#333', color: '#fff', padding: '20px' }}>
      <h3>Navigation</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link></li>
        <li><Link to="/appointments" style={{ color: '#fff', textDecoration: 'none' }}>Appointments</Link></li>
        <li><Link to="/policies" style={{ color: '#fff', textDecoration: 'none' }}>Policies</Link></li>
        <li><Link to="/interactions" style={{ color: '#fff', textDecoration: 'none' }}>Interactions</Link></li>
        <li><Link to="/claims" style={{ color: '#fff', textDecoration: 'none' }}>Claims</Link></li>
        <li><Link to="/customers" style={{ color: '#fff', textDecoration: 'none' }}>Customers</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;