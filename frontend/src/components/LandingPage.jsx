import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initial animation for the hero section
    const hero = document.querySelector('.hero-content');
    hero.style.opacity = '1';
    hero.style.transform = 'translateY(0)';
  }, []);

  const containerStyle = {
    minHeight: 'calc(100vh - 64px)',
    background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
    padding: '40px 20px',
    position: 'relative',
    overflow: 'hidden'
  };

  const heroContentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    color: 'white',
    opacity: '0',
    transform: 'translateY(30px)',
    transition: 'all 1s ease',
    position: 'relative',
    zIndex: 2
  };

  const headingStyle = {
    fontSize: '4rem',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    fontWeight: '800',
    letterSpacing: '1px'
  };

  const subheadingStyle = {
    fontSize: '1.8rem',
    marginBottom: '50px',
    opacity: '0.9',
    fontWeight: '300'
  };

  const buttonStyle = {
    backgroundColor: 'white',
    color: '#FF6B6B',
    padding: '20px 50px',
    fontSize: '1.3rem',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    marginBottom: '50px',
    fontWeight: '600',
    position: 'relative',
    overflow: 'hidden'
  };

  const cardsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#333',
    display: 'none',
    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const iconStyle = {
    fontSize: '4rem',
    marginBottom: '20px',
    transition: 'transform 0.3s ease'
  };

  const showOptions = () => {
    // Hide the get started button with animation
    const btn = document.getElementById('get-started-btn');
    btn.style.transform = 'scale(0)';
    
    // Show cards with staggered animation
    const cards = document.querySelectorAll('.register-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.transform = 'translateY(0) scale(1)';
          card.style.opacity = '1';
        }, 50);
      }, index * 200);
    });
  };

  // Add hover animations for cards
  const handleCardHover = (e, isHovering) => {
    const card = e.currentTarget;
    const icon = card.querySelector('.card-icon');
    const button = card.querySelector('.card-button');
    
    if (isHovering) {
      card.style.transform = 'translateY(-10px)';
      icon.style.transform = 'scale(1.1) rotate(5deg)';
      button.style.backgroundColor = '#FF6B6B';
      button.style.color = 'white';
    } else {
      card.style.transform = 'translateY(0)';
      icon.style.transform = 'scale(1) rotate(0)';
      button.style.backgroundColor = 'white';
      button.style.color = '#FF6B6B';
    }
  };

  const cardItems = [
    {
      icon: '🏢',
      title: 'Organization',
      description: 'Create and manage sports events, provide opportunities for athletes',
      path: 'organization'
    },
    {
      icon: '🏃',
      title: 'Athlete',
      description: 'Find opportunities, connect with organizations, and showcase your talents',
      path: 'athlete'
    },
    {
      icon: '💝',
      title: 'Donor',
      description: 'Support athletes and organizations, make a difference in sports',
      path: 'donor'
    }
  ];

  return (
    <div style={containerStyle}>
      <div className="hero-content" style={heroContentStyle}>
        <h1 style={headingStyle}>Welcome to Sports Connect</h1>
        <p style={subheadingStyle}>
          Empowering Athletes, Organizations, and Donors to Create a Stronger Sports Community
        </p>
        
        <button 
          id="get-started-btn"
          style={{
            ...buttonStyle,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={showOptions}
          onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.target.style.transform = 'scale(1)'}
        >
          Get Started
        </button>

        <div style={cardsContainerStyle}>
          {cardItems.map((item, index) => (
            <div 
              key={index}
              className="register-card"
              style={{
                ...cardStyle,
                transform: 'translateY(50px) scale(0.9)',
                opacity: 0,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={() => navigate(`/login/${item.path}`)}
              onMouseEnter={e => handleCardHover(e, true)}
              onMouseLeave={e => handleCardHover(e, false)}
            >
              <div className="card-icon" style={iconStyle}>{item.icon}</div>
              <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '1.8rem' }}>{item.title}</h2>
              <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
                {item.description}
              </p>
              <button 
                className="card-button"
                style={{
                  ...buttonStyle,
                  marginBottom: '0',
                  padding: '15px 30px',
                  fontSize: '1.1rem',
                  backgroundColor: 'white',
                  color: '#FF6B6B',
                  boxShadow: '0 5px 15px rgba(255, 107, 107, 0.2)'
                }}
              >
                Login as {item.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
