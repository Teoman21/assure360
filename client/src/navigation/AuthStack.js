// src/routes/AuthStack.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../components/authentication/Login';


const AuthStack = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AuthStack;
