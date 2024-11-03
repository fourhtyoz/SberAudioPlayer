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

// // frontend/src/App.js
// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [fileName, setFileName] = useState('');

//   const handlePlaySound = async () => {
//     try {
//       const response = await axios.post('http://localhost:8000/play-sound/', { file_name: fileName });
//       alert(response.data.message);
//     } catch (error) {
//       alert("Error playing sound.");
//     }
//   };

//   return (
//     <div>
//       <h1>Play Sound</h1>
//       <input
//         type="text"
//         value={fileName}
//         onChange={(e) => setFileName(e.target.value)}
//         placeholder="Enter file name"
//       />
//       <button onClick={handlePlaySound}>Play Sound</button>
//     </div>
//   );
// }

// export default App;

