import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Page/Home';
import LoginPage from './Page/LoginPage';
import { ContextProvider } from './Context/Context';
import Navbar from './Component/Navbar';
import "./App.css"

function App() {

  return (
        <ContextProvider>
        <Navbar />
          <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
          </BrowserRouter>
        </ContextProvider>
    );
}

export default App;
