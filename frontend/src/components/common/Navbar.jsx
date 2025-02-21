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

  return (
    <nav className="sticky top-0 z-50 bg-white/95 p-4 shadow-md">
      <div className="mx-auto max-w-7xl flex justify-between items-center px-5">
        <Link 
          to="/" 
          className="text-[#FF6B6B] no-underline text-3xl font-bold flex items-center gap-3 transition-transform duration-300 hover:scale-105"
        >
          <span>🏆</span> Sports Connect
        </Link>
        
        <div className="relative">
          {!isLoggedIn ? (
            <>
              <button 
                className="px-5 py-2 bg-[#FF6B6B] text-white rounded-full cursor-pointer text-lg transition-colors duration-300 hover:bg-[#ff5252]"
                onClick={() => setShowLoginOptions(!showLoginOptions)}
              >
                Login
              </button>
              
              {showLoginOptions && (
                <div className="absolute top-full right-0 bg-white rounded-lg shadow-lg py-2 mt-2 min-w-[200px]">
                  <Link 
                    to="/login/organization" 
                    className="block px-5 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setShowLoginOptions(false)}
                  >
                    Organization Login
                  </Link>
                  <Link 
                    to="/login/athlete" 
                    className="block px-5 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setShowLoginOptions(false)}
                  >
                    Athlete Login
                  </Link>
                  <Link 
                    to="/login/donor" 
                    className="block px-5 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setShowLoginOptions(false)}
                  >
                    Donor Login
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to={`/${userType}/dashboard`}
                className="px-5 py-2 bg-green-500 text-white rounded-full cursor-pointer text-lg transition-colors duration-300 hover:bg-green-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-full cursor-pointer text-lg transition-colors duration-300 hover:bg-red-600"
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