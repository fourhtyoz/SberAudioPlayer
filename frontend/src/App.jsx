import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import styled from 'styled-components';


const SWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

export default function App() {
    return (
        <SWrapper>
            <Header />
            <Main />
            {/* <Footer /> */}
        </SWrapper>
  );
}

