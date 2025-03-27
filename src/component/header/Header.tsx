import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link } from 'react-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (loading) {
    return <div className="navbar">Carregando...</div>;
  }

  return (
    <nav className='navbar'>
      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        ☰
      </button>
      <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Ínicio</Link>
        <Link to="/projetos" onClick={() => setMobileMenuOpen(false)}>Projetos</Link>
        <Link to="/agendamento" onClick={() => setMobileMenuOpen(false)}>Agendamento</Link>
        
        <div className="navbar-divider"></div>
        
        {user ? (
          <div className="user-dropdown">
            <button className="user-button" onClick={toggleDropdown}>
              {user.displayName || user.email || 'Usuário'}
              <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item logout-button" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
            <button className='button'>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;