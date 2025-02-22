import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, Heart, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showCards, setShowCards] = useState(false);

  const cardItems = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Organization',
      description: 'Create and manage sports events, provide opportunities for athletes',
      path: 'organization',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Athlete',
      description: 'Find opportunities, connect with organizations, and showcase your talents',
      path: 'athlete',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Donor',
      description: 'Support athletes and organizations, make a difference in sports',
      path: 'donor',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom 0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
              🚀 Welcome to the Future of Sports
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            UnnatiVeer
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12">
            Empowering Athletes, Organizations, and Donors to Create a Stronger Sports Community
          </p>
          
          {!showCards && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCards(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-full 
                       shadow-lg hover:shadow-xl transition-all duration-300 text-lg group"
            >
              Get Started
              <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </motion.div>

        {showCards && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {cardItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/login/${item.path}`)}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
                  <p className="text-slate-300 mb-8 leading-relaxed">
                    {item.description}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${item.gradient} text-white 
                             font-medium px-6 py-3 rounded-full transition-all duration-300 
                             flex items-center justify-center group`}
                  >
                    Sign up as {item.title}
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;