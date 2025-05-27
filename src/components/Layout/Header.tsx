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
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon
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

  const renderNavigationItem = (item: NavigationItem | DropdownGroup, isMobile = false) => {
    if ('items' in item) {
      // Это группа с выпадающим меню
      const isOpen = openDropdown === item.name;
      
      if (isMobile) {
        return (
          <div key={item.name}>
            <button
              onClick={() => handleDropdownToggle(item.name)}
              className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300 hover:text-primary-500 px-3 py-2 text-base font-medium"
            >
              <div className="flex items-center">
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="pl-6 space-y-1">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.tab ? `${subItem.href}?tab=${subItem.tab}` : subItem.href}
                    className="block text-gray-600 dark:text-gray-400 hover:text-primary-500 px-3 py-2 text-sm"
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
        <div key={item.name} className="relative">
          <button
            onClick={() => handleDropdownToggle(item.name)}
            className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
              {item.items.map((subItem) => (
                <Link
                  key={subItem.name}
                  to={subItem.tab ? `${subItem.href}?tab=${subItem.tab}` : subItem.href}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
      if (isMobile) {
        return (
          <Link
            key={item.name}
            to={item.tab ? `${item.href}?tab=${item.tab}` : item.href}
            className="text-gray-700 dark:text-gray-300 hover:text-primary-500 block px-3 py-2 text-base font-medium"
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
          className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
        >
          {item.name}
        </Link>
      );
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">С</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                СуперСТО
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {getNavigation().map((item) => renderNavigationItem(item))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                    className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}

                {/* Chat */}
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ChatBubbleLeftRightIcon className="h-6 w-6" />
                  {chatUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chatUnreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications */}
                <Link
                  to="/profile"
                  className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span className="hidden lg:block">{user?.name}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>

                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      {getUserMenuItems().map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-secondary text-sm">
                  Войти
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Регистрация
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {getNavigation().map((item) => renderNavigationItem(item, true))}
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    {getUserMenuItems().map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="text-gray-700 dark:text-gray-300 hover:text-primary-500 block px-3 py-2 text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-500 block px-3 py-2 text-base font-medium w-full text-left"
                    >
                      Выйти
                    </button>
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