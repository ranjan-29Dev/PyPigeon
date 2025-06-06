import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled ? 'bg-white/80 dark:bg-dark-200/80 backdrop-blur-sm' : 'bg-white dark:bg-dark-200'
    } shadow-sm`}>
      <nav className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <svg
              className="w-6 h-6 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6c-3 0-6 1-8 3 0 4 2 7 8 7s8-3 8-7c-2-2-5-3-8-3z"
              />
              <circle cx="9" cy="9" r="1" fill="currentColor" />
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
              PyPigeon
            </span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`${
                isActive('/') 
                  ? 'text-primary-500 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
              } transition-colors duration-200`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${
                isActive('/about')
                  ? 'text-primary-500 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
              } transition-colors duration-200`}
            >
              About
            </Link>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-100 hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
} 