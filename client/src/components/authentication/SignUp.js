import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const SignUp = () => {
  const { signUpContext, userToken, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !username || !fullName) {
      setMessage('Please fill out all fields.');
      return;
    }

    await signUpContext(email, password, fullName, username);
  };

  useEffect(() => {
    if (userToken) {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500); // Redirect after a short delay
    }
  }, [userToken, navigate]);

  useEffect(() => {
    if (error) {
      setMessage(error);
    }
  }, [error]);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up for Assure360</h2>
        <form onSubmit={handleSignUp}>
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
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {message && (
          <p className={error ? "error-text" : "success-text"}>{message}</p>
        )}
        <p>
          Already have an account? <span onClick={() => navigate('/auth/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
