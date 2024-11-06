import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';


export default function App() {
    const { user, isAuthenticated, login, logout } = useContext(AuthContext)

    return (
        <div>
            <Header />
            <Navbar user={user} isAuthenticated={isAuthenticated} login={login} logout={logout} />
            <Main isAuthenticated={isAuthenticated}/>
            <Footer />
        </div>
  );
}

