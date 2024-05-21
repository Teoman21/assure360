// src/routes/AppStack.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/views/dashboard/Dashboard';
import Appointments from '../components/views/appointments/Appointments';
import Policies from '../components/views/policies/Policies';
import Interactions from '../components/views/interactions/Interactions';
import Claims from '../components/views/claims/Claims';
import Customers from '../components/views/customers/Customers';

const AppStack = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/interactions" element={<Interactions />} />
      <Route path="/claims" element={<Claims />} />
    </Routes>
  );
};

export default AppStack;
