import React from 'react'
import { Route, Routes } from 'react-router';
import Home from './component/home/Home';
import Login from './component/login/Login';
import Register from './component/register/Register';

const Rotas = () => {
  return (
    <div>
      <Routes>
        <Route path= "/" element={<Home />} />
        <Route path= "/login/*" element ={<Login/>} />
        <Route path= "/register" element ={<Register/>}/>
      </Routes> 
    </div>
  )
}

export default Rotas