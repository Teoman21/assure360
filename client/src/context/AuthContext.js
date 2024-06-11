import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  const loginContext = async (email, password) => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, { email, password });
      console.log("LOGIN ATTEMPT RESPONSE: ", response.data.message);
      if (response.data && response.data.token && response.data.UserId) {
        const { token, UserId } = response.data;
        setUserToken(token);
        setUserId(UserId);
        localStorage.setItem('userToken', token); // Save token as a plain string
        localStorage.setItem('UserId', UserId); // Save user ID as a plain string
        console.log('Login successful, token and UserId set:', { token, UserId });
      } else {
        console.log('Login failed:', response.data.message);
        setError(response.data.message);
        setUserToken(null);
        setUserId(null);
      }
    } catch (error) {
      console.log(`Login error: ${error}`);
      setError('Login failed due to an error.');
      setUserToken(null);
      setUserId(null);
    }
    setIsLoading(false);
  };

  const signUpContext = async (email, password, username, firstName, lastName, role) => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
            email,
            password,
            firstName,
            lastName,
            username,
            role
        });
        console.log("SIGNUP ATTEMPT RESPONSE: ", response.data.message);
        if (response.data && response.data.token && response.data.UserId) {
            const { token, UserId } = response.data;
            setUserToken(token);
            setUserId(UserId);
            localStorage.setItem('userToken', token); // Save token as a plain string
            localStorage.setItem('UserId', UserId); // Save user ID as a plain string
            console.log('Signup successful, token and UserId set:', { token, UserId });
        } else {
            console.log('Signup failed:', response.data.message);
            setError(response.data.message);
        }
    } catch (error) {
        console.log(`Signup error: ${error}`);
        setError('Signup failed due to an error.');
    }
    setIsLoading(false);
};



  const logoutContext = () => {
    setIsLoading(true);
    setUserToken(null);
    setUserId(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('UserId');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = localStorage.getItem('userToken');
      let savedUserId = localStorage.getItem('UserId');
      console.log('Retrieved from local storage:', { userToken, savedUserId });
      if (userToken && savedUserId) {
        setUserId(savedUserId);
        setUserToken(userToken);
        console.log('isLoggedIn check, token and UserId:', { userToken, savedUserId });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(`isLoggedIn error: ${error}`);
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    console.log('Running isLoggedIn check...');
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loginContext, logoutContext, signUpContext, isLoading, userToken, userId, error }}>
      {children}
    </AuthContext.Provider>
  );
};
