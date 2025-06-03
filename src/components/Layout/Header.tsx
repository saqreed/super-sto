import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon, 
  BellIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              🚗 СуперСТО
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Главная
            </Link>
            <Link to="/booking" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Запись
            </Link>
            <Link to="/parts" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Запчасти
            </Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              О нас
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link to="/cart" className="relative p-2 text-gray-500 hover:text-gray-700">
                  <ShoppingCartIcon className="h-5 w-5" />
                </Link>

                {/* Notifications */}
                <Link to="/profile" className="relative p-2 text-gray-500 hover:text-gray-700">
                  <BellIcon className="h-5 w-5" />
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span>{user?.firstName || user?.name || 'Пользователь'}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Профиль
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
                >
                  Войти
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Регистрация
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
            <Link
              to="/booking"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Запись
            </Link>
            <Link
              to="/parts"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Запчасти
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 