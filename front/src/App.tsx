// import { useState } from 'react'
import Home from "./scenes/Home";
import About from "./scenes/About";
import Scoreboard from "./scenes/Scoreboard";
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameContextProvider } from './store/index';
import { Web2ContextProvider } from './store/web2store';

function App() {
  return (
    <>
      <Web2ContextProvider>
        <GameContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/score" element={<Scoreboard />} />
            </Routes>
          </BrowserRouter>
        </GameContextProvider>
      </Web2ContextProvider>
    </>
  );
}

export default App
