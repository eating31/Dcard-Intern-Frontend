import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Page/Home';
import Login from './Page/Login';
import Detail from './Page/Detail';
// import { ContextProvider } from './Contexts/Context';
import Navbar from './Component/Navbar';

const CLIENT_ID = '7e2ec405ab8a9a9c9528';

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
