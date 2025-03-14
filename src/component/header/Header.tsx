import React from 'react'
import './Header.css';
import { Link, useNavigate } from 'react-router';


const Header = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login')
  }
  
  return (
   <nav className='navbar'>
    <div className='navbar-links'>
      <Link to ="/">Ínicio</Link>
      <Link to ="/projetos">Projetos</Link>
      <Link to ="/agendamento">Agendamento</Link>
      <hr />
      <button onClick={handleClick} className='button'>Login</button>
    </div>
   </nav>
  );
}

export default Header