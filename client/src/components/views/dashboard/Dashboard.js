import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const goToCustomers = () => {
    navigate('/dashboard/customers');
  };

  console.log('Rendering Dashboard component');
  return (
    <div>
      <h1>Dashboard</h1>
      <image></image>
      <button onClick={goToCustomers}>Go to Customers</button>
    </div>
  );
};

export default Dashboard;
