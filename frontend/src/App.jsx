import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import styled from 'styled-components';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';


const SWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

export default function App() {
    const { user, isAuthenticated, login, logout } = useContext(AuthContext)
    return (
        <SWrapper>
            <Header user={user} logout={logout} />
            <Main isAuthenticated={isAuthenticated} login={login} />
        </SWrapper>
  );
}

