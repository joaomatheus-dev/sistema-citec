import React from 'react'
import './Header.css';


const Header = () => {
  return (
   <nav className='navbar'>
    <div className='navbar-links'>
      <a href='#home'>Ínicio</a>
      <a href='#home'>Projetos</a>
      <a href='#home'>Agendamento</a>
      <hr />
      <button className='button'>Login</button>
    </div>
   </nav>
  );
}

export default Header