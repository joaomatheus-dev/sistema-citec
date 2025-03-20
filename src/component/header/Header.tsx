import React from 'react'
import './Header.css';
import { Link } from 'react-router';


const Header = () => {
  
  return (
   <nav className='navbar'>
    <div className='navbar-links'>
      <Link to ="/">Ínicio</Link>
      <Link to ="/projetos">Projetos</Link>
      <Link to ="/agendamento">Agendamento</Link>
      <hr />
      <Link to="/login">
        <button className='button'>Login</button>
      </Link>
    </div>
   </nav>
  );
}

export default Header