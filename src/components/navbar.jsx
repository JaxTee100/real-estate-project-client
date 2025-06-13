'use client'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut, Menu, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = (
    <>
      <motion.span 
        className="text-black hover:text-gray-900 transition-colors font-semibold tracking-wider text-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {user?.name}
      </motion.span>
      <motion.button
        onClick={handleLogout}
        className="flex items-center gap-1 text-black  hover:text-gray-900 transition-colors font-semibold tracking-wider text-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </motion.button>
    </>
  );

  return (
    <motion.nav 
      className={`fixed w-full z-50 px-4 sm:px-8 py-4 transition-all duration-300 ${
        scrolled ? 'bg-slate-200/95 backdrop-blur-sm shadow-lg' : 'bg-slate-200'
      } `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center"
        >
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
            VERIFIED HOMES
          </h1>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col items-center gap-4 py-4">
              {React.Children.map(navItems.props.children, (child, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full text-center py-2"
                >
                  {child}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar