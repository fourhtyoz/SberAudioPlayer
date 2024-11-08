import React from "react"
import styled from "styled-components";
import useIsMobile from "../hooks/useMobile";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';


const SHeader = styled.header`
    border: 1px solid #ececec;
    padding: 1em;
    display: flex;
    justify-content: ${({ isMobile }) => (isMobile ? 'center' : 'space-between')};
`

const STitle = styled.h1`
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`

const SUserInfo = styled.div`
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`

const SButton = styled.button`
    width: 100%;
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #000;
    border: none;
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
`

export default function Header() {
    const isMobile = useIsMobile();
    const { user, isAuthenticated, logout } = useContext(AuthContext)

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
        <SHeader isMobile={isMobile}>
            <STitle>Тестовое задание в Robotics Center</STitle>
            {user?.sub && 
            <div>
                <SUserInfo>{`Добро пожаловать, ${user.sub}`}</SUserInfo>
                <SButton onClick={handleLogout}>Выйти</SButton>
            </div>}
        </SHeader>
    )    
}