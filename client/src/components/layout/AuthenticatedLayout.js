import React from 'react';
import Sidebar from './SideBar';
import { Outlet } from 'react-router-dom';
import './AuthenticatedLayout.css'; // Import your CSS for layout if needed

const AuthenticatedLayout = () => {
  return (
    <div className="authenticated-layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
