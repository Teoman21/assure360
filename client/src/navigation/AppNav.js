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
        // Render the main app stack if the user is authenticated
        <Route path="/*" element={<AppStack />} />
      ) : (
        // Render the authentication stack if the user is not authenticated
        <>
          <Route path="/auth/*" element={<AuthStack />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      )}
    </Routes>
  );
};

export default AppNav;