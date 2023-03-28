import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Page/Home';
import Test from './Component/test';
import Detail from './Page/Detail';
import { ContextProvider } from './Context/Context';
import Navbar from './Component/Navbar';

function App() {

  return (
      <div>
        <ContextProvider>
        <Navbar />
          <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/detail' element={<Detail />}></Route>
                <Route path='/test' element={<Test />}></Route>
            </Routes>
          </BrowserRouter>
        </ContextProvider>
      </div>
    );
}

export default App;
