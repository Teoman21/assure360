// src/routes/AuthStack.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';

const AuthStack = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default AuthStack;
