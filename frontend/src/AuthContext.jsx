// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // To decode JWT
import axios from 'axios';
import { API_URL } from './utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
 
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = jwtDecode(token);
            if (decodedUser?.exp && decodedUser?.exp <= 0) {
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            } else {
                setUser(decodedUser);
                setIsAuthenticated(true);
            }
        }
    }, []);

    const login = async (username, password) => {
        const response = await axios.post(`${API_URL}/login/`, { username, password });
        const token = response.data.access_token
        if (token) {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
            setIsAuthenticated(true);
            localStorage.setItem('token', token);
        }
        return response.data;
    };


    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
