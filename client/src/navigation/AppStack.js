import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/views/Dashboard';
import Appointments from '../components/views/Appointments';
import Policies from '../components/views/Policies';
import Interactions from '../components/views/Interactions';
import Claims from '../components/views/Claims';
import Customers from '../components/views/Customers';

const AppStack = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="/interactions" element={<Interactions />} />
      <Route path="/claims" element={<Claims />} />
      <Route path="/customers" element={<Customers />} />
    </Routes>
  );
};

export default AppStack;