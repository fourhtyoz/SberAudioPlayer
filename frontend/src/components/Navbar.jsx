// frontend/src/App.js
import React, { useState } from 'react';
import { register } from '../utils/api';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import styled from 'styled-components';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';


const SRow = styled.div`
    display: flex;
`

const SButton = styled.button`
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #000;
    border: none;
    width: 150px;
    width: 300px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    border: 1px solid #000;
    display: block;

    &:hover {
    border: 1px solid #cecece;
    color: #000;
    background-color: #FFF;
    }

    &:active {
    transform: scale(0.98);
    }

    &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    }
`;

const StyledInput = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    outline: none;
    width: 300px;
    box-sizing: border-box;
    display: block;
    margin-top: 10px;

    &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    &::placeholder {
    color: #aaa;
    }
`;


export default function Navbar() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { user, isAuthenticated, login, logout } = useContext(AuthContext)


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
        <nav>
            {!isAuthenticated &&
                <>
                    <SRow>
                        <StyledInput type="text" placeholder="Имя" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </SRow>
                    <SRow>
                        <StyledInput type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </SRow>
                        <SButton onClick={handleLogin}>Вход</SButton>
                        <SButton onClick={handleRegister}>Регистрация</SButton>
                </>
            }
        </nav>
    );
}
