import React from 'react';
import Queue from './Queue';
import styled from 'styled-components';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Login from './Login';
import AudioDropzone from './AudioDropzone';


const SMain = styled.main`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
`

const SText = styled.div`
    font-weight: bold;
    padding: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`

export default function Main() {
    const { isAuthenticated } = useContext(AuthContext)

    if (!isAuthenticated) {
        return (
            <SMain>
                <SText>Чтобы воспользоваться сервисом, необходимо войти или зарегистрироваться</SText>
                <Login />
            </SMain>
        ) 
    } else {
        return (
            <SMain>
                <AudioDropzone />
                <Queue />
            </SMain>
        );
    }
};
