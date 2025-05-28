import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import ChatWindow from '../Chat/ChatWindow';

interface NavigationItem {
  name: string;
  href: string;
  tab?: string;
  icon?: React.ComponentType<any>;
}

interface DropdownGroup {
  name: string;
  icon: React.ComponentType<any>;
  items: NavigationItem[];
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { totalItems } = useAppSelector(state => state.cart);
  const { unreadCount } = useAppSelector(state => state.notifications);
  const { unreadCount: chatUnreadCount } = useAppSelector(state => state.chat);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleDropdownToggle = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Закрываем выпадающие меню при клике вне их
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.relative')) {
        setOpenDropdown(null);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNavigation = (): (NavigationItem | DropdownGroup)[] => {
    // Навигация для клиентов и неавторизованных пользователей
    const clientNavigation: (NavigationItem | DropdownGroup)[] = [
      { name: 'Главная', href: '/' },
      { name: 'Запись на обслуживание', href: '/booking' },
      { name: 'Каталог деталей', href: '/parts' },
      { name: 'О нас', href: '/about' },
      { name: 'Контакты', href: '/contact' },
    ];

    // Добавляем программу лояльности для авторизованных клиентов
    if (isAuthenticated && user?.role === 'client') {
      clientNavigation.splice(3, 0, { name: 'Программа лояльности', href: '/loyalty' });
    }

    // Навигация для мастеров
    const masterNavigation: (NavigationItem | DropdownGroup)[] = [
      { name: 'Главная', href: '/' },
      {
        name: 'Рабочая панель',
        icon: WrenchScrewdriverIcon,
        items: [
          { name: 'Мои заявки', href: '/master', tab: 'requests' },
          { name: 'Статистика', href: '/master', tab: 'stats' },
        ]
      },
      { name: 'Профиль', href: '/profile' },
    ];

    // Навигация для администраторов
    const adminNavigation: (NavigationItem | DropdownGroup)[] = [
      { name: 'Главная', href: '/' },
      {
        name: 'Управление',
        icon: CogIcon,
        items: [
          { name: 'Обзор', href: '/admin', tab: 'overview' },
          { name: 'Пользователи', href: '/admin', tab: 'users' },
          { name: 'Заявки', href: '/admin', tab: 'requests' },
          { name: 'Услуги и СТО', href: '/admin', tab: 'services' },
        ]
      },
      {
        name: 'Аналитика',
        icon: ChartBarIcon,
        items: [
          { name: 'Отчеты', href: '/admin', tab: 'analytics' },
        ]
      },
      {
        name: 'Мастер',
        icon: WrenchScrewdriverIcon,
        items: [
          { name: 'Панель мастера', href: '/master' },
        ]
      },
    ];

    if (!isAuthenticated || user?.role === 'client') {
      return clientNavigation;
    } else if (user?.role === 'master') {
      return masterNavigation;
    } else if (user?.role === 'admin') {
      return adminNavigation;
    }

    return clientNavigation;
  };

  const getUserMenuItems = () => {
    const items = [];

    // Для клиентов показываем профиль, корзину и программу лояльности
    if (user?.role === 'client') {
      items.push(
        { name: 'Профиль', href: '/profile' },
        { name: 'Корзина', href: '/cart' },
        { name: 'Программа лояльности', href: '/loyalty' }
      );
    }
    // Для мастеров и админов только профиль, так как остальное уже в навигации
    else {
      items.push({ name: 'Профиль', href: '/profile' });
    }

    return items;
  };

  const isActiveRoute = (href: string, tab?: string) => {
    if (tab) {
      return location.pathname === href && location.search.includes(`tab=${tab}`);
    }
    return location.pathname === href;
  };

  const renderNavigationItem = (item: NavigationItem | DropdownGroup, isMobile = false) => {
    if ('items' in item) {
      // Это группа с выпадающим меню
      const isOpen = openDropdown === item.name;
      const hasActiveItem = item.items.some(subItem => isActiveRoute(subItem.href, subItem.tab));
      
      if (isMobile) {
        return (
          <div key={item.name}>
            <button
              onClick={() => handleDropdownToggle(item.name)}
              className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                hasActiveItem || isOpen
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center">
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="ml-8 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.tab ? `${subItem.href}?tab=${subItem.tab}` : subItem.href}
                    className={`block px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                      isActiveRoute(subItem.href, subItem.tab)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      }

      return (
        <div key={item.name} className="relative group">
          <button
            onClick={() => handleDropdownToggle(item.name)}
            className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              hasActiveItem || isOpen
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
              {item.items.map((subItem) => (
                <Link
                  key={subItem.name}
                  to={subItem.tab ? `${subItem.href}?tab=${subItem.tab}` : subItem.href}
                  className={`block px-4 py-3 text-sm transition-all duration-200 ${
                    isActiveRoute(subItem.href, subItem.tab)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-medium border-l-2 border-primary-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setOpenDropdown(null)}
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      // Обычный элемент навигации
      const isActive = isActiveRoute(item.href, item.tab);
      
      if (isMobile) {
        return (
          <Link
            key={item.name}
            to={item.tab ? `${item.href}?tab=${item.tab}` : item.href}
            className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500'
                : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.name}
          </Link>
        );
      }

      return (
        <Link
          key={item.name}
          to={item.tab ? `${item.href}?tab=${item.tab}` : item.href}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
            isActive
              ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
              : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          {item.name}
          {isActive && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
          )}
        </Link>
      );
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <SparklesIcon className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  СуперСТО
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Автосервис
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {getNavigation().map((item) => renderNavigationItem(item))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Cart - только для клиентов */}
                {user?.role === 'client' && (
                  <Link
                    to="/cart"
                    className="relative p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}

                {/* Chat */}
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="relative p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  {chatUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                      {chatUnreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications */}
                <Link
                  to="/profile"
                  className="relative p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden lg:block font-medium">{user?.name}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
                      {getUserMenuItems().map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  Войти
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Регистрация
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-b-xl border-t border-gray-200/50 dark:border-gray-700/50">
              {getNavigation().map((item) => renderNavigationItem(item, true))}
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="space-y-1">
                      {getUserMenuItems().map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      >
                        Выйти
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </header>
  );
};

export default Header; 