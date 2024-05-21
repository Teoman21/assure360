import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const AppNav = () => {
  const { userToken } = useContext(AuthContext);

  return (
    <Routes>
      {userToken ? (
        <>
          <Route path="/dashboard/*" element={<AppStack />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthStack />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppNav;
