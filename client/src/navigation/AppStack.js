import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import Dashboard from '../components/views/dashboard/Dashboard';
import Customers from '../components/views/customers/Customers';
import Appointments from '../components/views/appointments/Appointments';
import Policies from '../components/views/policies/Policies';
import Interactions from '../components/views/interactions/Interactions';
import Claims from '../components/views/claims/Claims';

const AppStack = () => {
  console.log("Rendering AppStack");
  return (
    <Routes>
      <Route element={<AuthenticatedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="policies" element={<Policies />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="interactions" element={<Interactions />} />
        <Route path="claims" element={<Claims />} />
      </Route>
    </Routes>
  );
};

export default AppStack;
