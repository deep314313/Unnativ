import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut, LayoutDashboard, Medal, Users } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    if (token && storedUserType) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType('');
    navigate('/');
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav 
      initial={false}
      animate={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'
      }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50"
    >
      <div className="mx-auto max-w-7xl flex justify-between items-center px-6 py-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <Medal className="w-8 h-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            UnnatiVeer
          </span>
        </Link>
        
        <div className="relative">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/athletes"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium 
                         flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
              >
                <Users className="w-4 h-4" />
                Athletes
              </Link>
            </motion.div>
            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/athletes"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium 
                               flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Users className="w-4 h-4" />
                      Athletes
                    </Link>
                  </motion.div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                             text-base font-medium flex items-center gap-2 transition-colors duration-200"
                    onClick={() => setShowLoginOptions(!showLoginOptions)}
                  >
                    Login
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLoginOptions ? 'rotate-180' : ''}`} />
                  </motion.button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={`/${userType}/dashboard`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium 
                               flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium 
                             flex items-center gap-2 hover:bg-gray-300 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;