import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Page/Home';
import Login from './Page/Login';
import Detail from './Page/Detail';
// import { ContextProvider } from './Contexts/Context';
import Navbar from './Component/Navbar';

function App() {

  return (
      <div>
      <Navbar />
      {/* <ContextProvider> */}
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path='/login' element={<Login />}></Route>
              <Route path='/detail' element={<Detail />}></Route>
          </Routes>
        </BrowserRouter>
        {/* </ContextProvider> */}
        </div>
    );
}

export default App;
