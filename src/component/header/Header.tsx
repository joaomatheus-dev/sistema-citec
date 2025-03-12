import React from 'react'
import './Header.css';


const Header = () => {
  return (
   <nav className='navbar'>
    <div className='navbar-links'>
      <a href='#home'>Ínicio</a>
      <a href='#home'>Projetos</a>
      <a href='#home'>Agendamento</a>
      <hr style={{ border: '0.5px solid black', height: '10px' }} />
      <button className='button'>Logar</button>
    </div>
   </nav>
  );
}

export default Header