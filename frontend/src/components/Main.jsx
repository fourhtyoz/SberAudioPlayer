import React from 'react';
import UploadAudio from './UploadAudio';
import Queue from './Queue';
import styled from 'styled-components';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Navbar from './Navbar';


const SMain = styled.main`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // width: 500px;
    // margin: 0 auto;
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
                <Navbar />
            </SMain>
        ) 
    } else {
        return (
            <SMain>
                <UploadAudio />
                <Queue />
            </SMain>
        );
    }
};
