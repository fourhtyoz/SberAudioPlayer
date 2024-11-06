// frontend/src/App.js
import React, { useState } from 'react';
import { register, getToken } from '../utils/api';
import { api } from '../utils/api';


export default function Navbar({ user, isAuthenticated, login, logout }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            await register(username, password);
            setMessage('Registered successfully. You can now log in.');
        } catch (error) {
            setMessage('Registration failed.');
        }
    };

    const handleLogin = async () => {
        try {
            await login(username, password);
            setMessage('Logged in successfully.');
        } catch (error) {
            setMessage('Login failed.');
        }
    };

    // const handleProtectedRequest = async () => {
    //     try {
    //         const token = getToken();
    //         const response = await api.get('http://localhost:8000/protected/', {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setMessage(response.data.message);
    //     } catch (error) {
    //         setMessage('Access denied.');
    //     }
    // };

    const handleLogout = async () => {
        try {
            await logout();
            setMessage('Logged out successfully.');
        } catch (error) {
            setMessage('Logout failed.');
        }
    }

    return (
        <div>
            {!isAuthenticated &&
                <>
                    <h1>Authentication System</h1>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </>
            }
            
            {!isAuthenticated && <button onClick={handleRegister}>Register</button>}
            {!isAuthenticated &&<button onClick={handleLogin}>Login</button>}
            {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
            {/* {isAuthenticated && <button onClick={handleProtectedRequest}>Access Protected Route</button>} */}

            <p>{message}</p>
        </div>
    );
}
