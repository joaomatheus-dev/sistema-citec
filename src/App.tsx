import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import "../src/component/header/Header"
import Header from '../src/component/header/Header';

import Footer from './component/footer/Footer';
import Home from './component/home/Home';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path= "/" element={<Home />} />
      </Routes>
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
