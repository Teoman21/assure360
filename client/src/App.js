import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppNav from './navigation/AppNav';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f4f4' }}>
        <AppNav />
      </div>
    </Router>
  );
};

export default App;