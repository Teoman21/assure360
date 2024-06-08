import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { loginContext, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Attempting to log in with:', { email, password });
    await loginContext(email, password);
    if (localStorage.getItem('userToken')) {
      console.log('User token found:', localStorage.getItem('userToken'));
      navigate('/dashboard');
    } else {
      console.log('No user token found after login');
      setMessage('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login to Assure360</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && (
          <p className={error ? "error-text" : "success-text"}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
