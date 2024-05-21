import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const Settings = () => {
  const { logoutContext } = useContext(AuthContext);

  const handleLogout = () => {
    logoutContext();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Settings</h2>
      <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>
    </div>
  );
};

const logoutButtonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  color: '#fff',
  backgroundColor: '#d9534f',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px'
};

export default Settings;
