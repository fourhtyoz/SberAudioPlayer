// frontend/src/App.js
import React, { useState } from 'react';
import { register } from '../utils/api';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';


export default function Navbar({ user, isAuthenticated, login, logout }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            await register(username, password);
            alertify.success('Регистрация прошла успешно')
        } catch (error) {
            console.log(error)
            alertify.error(`Ошибка при регистрации: ${error?.response?.data?.detail}`)
        }
    };

    const handleLogin = async () => {
        try {
            await login(username, password);
            alertify.success('Вы вошли в свой аккаунт')
        } catch (error) {
            console.log(error)
            alertify.error(`Ошибка при входе в аккаунт: ${error?.response?.data?.detail}`)
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            alertify.success('Вы вышли из своего аккаунта')
        } catch (error) {
            console.log(error)
            alertify.error(`Ошибка при выходе из аккаунта: ${error?.response?.data?.detail}`)
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

            {/* <p>{message}</p> */}
        </div>
    );
}
