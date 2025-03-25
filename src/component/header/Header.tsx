import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link } from 'react-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from 'sweetalert2';

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    
    const result = await Swal.fire({
      icon: 'question',
      title: 'Deslogar',
      text: 'Você tem certeza que deseja deslogar?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
    });
    
    if (!result.isConfirmed) return;

    const auth = getAuth();
    try {
      await signOut(auth);
      await Swal.fire({
        icon: 'success',
        title: 'Deslogado',
        text: 'Você foi deslogado com sucesso',
        showConfirmButton: true
      });
      window.location.href = '/';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
        showConfirmButton: true
      });
    }
  }

  if (loading) {
    return <div className="navbar">Carregando...</div>;
  }

  return (
    <nav className='navbar'>
      <div className='navbar-links'>
        <Link to="/">Ínicio</Link>
        <Link to="/projetos">Projetos</Link>
        <Link to="/agendamento">Agendamento</Link>
        <div className="navbar-divider"></div>
        {user ? (
          <Dropdown>
            <Dropdown.Toggle>
              {user.displayName || user.email || 'Usuário'}
            </Dropdown.Toggle>
      
            <Dropdown.Menu>
              <Dropdown.Item 
                onClick={handleLogout}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Link to="/login">
            <button className='button'>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;