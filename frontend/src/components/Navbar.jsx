import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/');
  };

  const renderAuthButtons = () => {
    if (token) {
      return (
        <>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#FF6B6B',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Logout
          </button>
          {userType === 'organization' && (
            <Link 
              to="/dashboard/organization"
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
                marginLeft: '10px'
              }}
            >
              Dashboard
            </Link>
          )}
          {userType === 'athlete' && (
            <Link 
              to="/dashboard/athlete"
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
                marginLeft: '10px'
              }}
            >
              Dashboard
            </Link>
          )}
        </>
      );
    }

    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link 
          to="/login/organization"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}
        >
          Organization Login
        </Link>
        <Link 
          to="/login/athlete"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}
        >
          Athlete Login
        </Link>
      </div>
    );
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
        <h1 style={{ margin: 0 }}>Sports Connect</h1>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link 
          to="/events"
          style={{
            color: '#333',
            textDecoration: 'none',
            marginRight: '20px'
          }}
        >
          Events
        </Link>
        <Link 
          to="/sponsorships"
          style={{
            color: '#333',
            textDecoration: 'none',
            marginRight: '20px'
          }}
        >
          Sponsorships
        </Link>
        {renderAuthButtons()}
      </div>
    </nav>
  );
};

export default Navbar; 