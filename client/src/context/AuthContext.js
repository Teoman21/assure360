import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [UserId, setUserId] = useState(null);

    const loginContext = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            console.log("LOGIN ATTEMPT: ",response.data.message);
            if(response.data && response.data.token && response.data.UserId) {
                const { token, UserId } = response.data;
                setUserToken(token);
                setUserId(UserId);
                localStorage.setItem('userToken', JSON.stringify(token));
                localStorage.setItem('UserId', JSON.stringify(UserId));
            } else {
                console.log('Login failed', response.data.message);
                setUserToken(null);
            }
        } catch (error) {
            console.log(`Login error: ${error}`);
            setUserToken(null);
        }
        setIsLoading(false);
    };

    const signUpContext = async (email, password, fullName, username) => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/auth/signup', {
                email,
                password,
                username,
                fullName
            });
            console.log("SIGNUP ATTEMPT: ", response.data.message);
            if(response.data && response.data.token && response.data.UserId) {
                const { token, UserId } = response.data;
                setUserToken(token);
                setUserId(UserId);
                localStorage.setItem('userToken', JSON.stringify(token));
                localStorage.setItem('UserId', JSON.stringify(UserId));
            } else {
                console.log('Signup failed', response.data.message);
            }
        } catch (error) {
            console.log(`Signup error: ${error}`);
        }
        setIsLoading(false);
    };

    const logoutContext = () => {
        setIsLoading(true);
        setUserToken(null);
        localStorage.removeItem('userToken');
        localStorage.removeItem('UserId');
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = localStorage.getItem('userToken');
            userToken = userToken != null ? JSON.parse(userToken) : null;
            let savedUserId = localStorage.getItem('UserId');
            savedUserId = savedUserId != null ? JSON.parse(savedUserId) : null;
            setUserId(savedUserId);
            setUserToken(userToken);
            setIsLoading(false);
        } catch (error) {
            console.log(`isLoggedIn error: ${error}`);
            setIsLoading(false); 
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{loginContext, logoutContext, signUpContext, isLoading, userToken, UserId}}>
            {children}
        </AuthContext.Provider>
    );
};