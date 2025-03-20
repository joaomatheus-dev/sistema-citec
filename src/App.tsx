import React from 'react';
import { BrowserRouter } from 'react-router';
import './App.css';
import "../src/component/header/Header"
import Header from '../src/component/header/Header';
import Rotas from './Rotas';
import Footer from './component/footer/Footer';



function App() {
  return (
    <div>
      <BrowserRouter>
      <Header />
      <Rotas />
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
