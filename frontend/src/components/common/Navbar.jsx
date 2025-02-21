import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    if (token && storedUserType) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType('');
    navigate('/');
  };

  const styles = {
    navStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '1rem',
      color: '#333',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
    },
    navContentStyle: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px'
    },
    logoStyle: {
      color: '#FF6B6B',
      textDecoration: 'none',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'transform 0.3s ease'
    },
    loginButton: {
      padding: '8px 20px',
      backgroundColor: '#FF6B6B',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease'
    },
    dropdownContainer: {
      position: 'relative'
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '8px 0',
      marginTop: '8px',
      minWidth: '200px',
      display: showLoginOptions ? 'block' : 'none'
    },
    dropdownItem: {
      display: 'block',
      padding: '10px 20px',
      color: '#333',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      fontSize: '1rem'
    },
    userButton: {
      padding: '8px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease'
    },
    logoutButton: {
      padding: '8px 20px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      marginLeft: '10px',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <nav style={styles.navStyle}>
      <div style={styles.navContentStyle}>
        <Link 
          to="/" 
          style={styles.logoStyle}
          onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.target.style.transform = 'scale(1)'}
        >
          <span>🏆</span> Sports Connect
        </Link>
        
        <div style={styles.dropdownContainer}>
          {!isLoggedIn ? (
            <>
              <button 
                style={styles.loginButton}
                onClick={() => setShowLoginOptions(!showLoginOptions)}
                onMouseOver={e => e.target.style.backgroundColor = '#ff5252'}
                onMouseOut={e => e.target.style.backgroundColor = '#FF6B6B'}
              >
                Login
              </button>
              
              {showLoginOptions && (
                <div style={styles.dropdownMenu}>
                  <Link 
                    to="/login/organization" 
                    style={styles.dropdownItem}
                    onClick={() => setShowLoginOptions(false)}
                    onMouseOver={e => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
                  >
                    Organization Login
                  </Link>
                  <Link 
                    to="/login/athlete" 
                    style={styles.dropdownItem}
                    onClick={() => setShowLoginOptions(false)}
                    onMouseOver={e => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
                  >
                    Athlete Login
                  </Link>
                  <Link 
                    to="/login/donor" 
                    style={styles.dropdownItem}
                    onClick={() => setShowLoginOptions(false)}
                    onMouseOver={e => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
                  >
                    Donor Login
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link
                to={`/${userType}/dashboard`}
                style={styles.userButton}
                onMouseOver={e => e.target.style.backgroundColor = '#45a049'}
                onMouseOut={e => e.target.style.backgroundColor = '#4CAF50'}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={styles.logoutButton}
                onMouseOver={e => e.target.style.backgroundColor = '#d32f2f'}
                onMouseOut={e => e.target.style.backgroundColor = '#f44336'}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 