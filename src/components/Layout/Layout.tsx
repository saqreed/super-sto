import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Badge, Button, Drawer } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ToolOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuOutlined,
  SettingOutlined,
  BarChartOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { fetchUnreadCount } from '../../store/slices/chatSlice';
import { fetchNotifications } from '../../store/slices/notificationsSlice';
import { USER_ROLES } from '../../types';
import { getUserFullName } from '../../utils';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}



const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount: chatUnreadCount } = useAppSelector((state) => state.chat);
  const { unreadCount: notificationUnreadCount } = useAppSelector((state) => state.notifications);

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isMaster = user?.role === USER_ROLES.MASTER;
  const isClient = user?.role === USER_ROLES.CLIENT;

  useEffect(() => {
    dispatch(fetchUnreadCount());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleMenuToggle = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setCollapsed(!collapsed);
    } else {
      setMobileDrawerVisible(true);
    }
  }, [collapsed]);

  // Мемоизированные элементы меню пользователя
  const userMenuItems = useMemo(() => [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: handleLogout,
    },
  ], [navigate, handleLogout]);

  // Мемоизированные элементы главного меню в зависимости от роли
  const menuItems = useMemo(() => {
    const items = [];

    // Общий дашборд для всех ролей
    items.push({
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Дашборд',
      onClick: () => navigate('/dashboard'),
    });

    if (isAdmin) {
      // Меню для администратора
      items.push(
        {
          key: '/admin',
          icon: <BarChartOutlined />,
          label: 'Аналитика',
          onClick: () => navigate('/admin'),
        },
        {
          key: '/admin/services',
          icon: <ToolOutlined />,
          label: 'Управление услугами',
          onClick: () => navigate('/admin/services'),
        },
        {
          key: '/admin/users',
          icon: <TeamOutlined />,
          label: 'Пользователи',
          onClick: () => navigate('/admin/users'),
        },
        {
          key: '/appointments',
          icon: <CalendarOutlined />,
          label: 'Все записи',
          onClick: () => navigate('/appointments'),
        },
        {
          key: '/orders',
          icon: <ShoppingCartOutlined />,
          label: 'Все заказы',
          onClick: () => navigate('/orders'),
        },
        {
          key: '/admin/reports',
          icon: <FileTextOutlined />,
          label: 'Отчеты',
          onClick: () => navigate('/admin/reports'),
        }
      );
    } else if (isMaster) {
      // Меню для мастера
      items.push(
        {
          key: '/appointments',
          icon: <CalendarOutlined />,
          label: 'Мои записи',
          onClick: () => navigate('/appointments'),
        },
        {
          key: '/orders',
          icon: <ShoppingCartOutlined />,
          label: 'Заказы',
          onClick: () => navigate('/orders'),
        },
        {
          key: '/chat',
          icon: (
            <Badge count={chatUnreadCount} size="small">
              <MessageOutlined />
            </Badge>
          ),
          label: 'Чат с клиентами',
          onClick: () => navigate('/chat'),
        }
      );
    } else if (isClient) {
      // Меню для клиента
      items.push(
        {
          key: '/services',
          icon: <ToolOutlined />,
          label: 'Услуги',
          onClick: () => navigate('/services'),
        },
        {
          key: '/appointments',
          icon: <CalendarOutlined />,
          label: 'Мои записи',
          onClick: () => navigate('/appointments'),
        },
        {
          key: '/products',
          icon: <ShoppingOutlined />,
          label: 'Продукты',
          onClick: () => navigate('/products'),
        },
        {
          key: '/orders',
          icon: <ShoppingCartOutlined />,
          label: 'Мои заказы',
          onClick: () => navigate('/orders'),
        },
        {
          key: '/chat',
          icon: (
            <Badge count={chatUnreadCount} size="small">
              <MessageOutlined />
            </Badge>
          ),
          label: 'Чат с мастерами',
          onClick: () => navigate('/chat'),
        }
      );
    }

    return items;
  }, [navigate, chatUnreadCount, isAdmin, isMaster, isClient]);

  // Обновляем PAGE_TITLES для разных ролей
  const getPageTitle = (pathname: string): string => {
    const baseTitles: Record<string, string> = {
      '/dashboard': 'Дашборд',
      '/profile': 'Профиль',
    };

    if (isAdmin) {
      return {
        ...baseTitles,
        '/admin': 'Аналитика',
        '/admin/services': 'Управление услугами',
        '/admin/users': 'Управление пользователями',
        '/admin/reports': 'Отчеты',
        '/appointments': 'Все записи',
        '/orders': 'Все заказы',
      }[pathname] || 'СуперСТО';
    } else if (isMaster) {
      return {
        ...baseTitles,
        '/appointments': 'Мои записи',
        '/orders': 'Заказы',
        '/chat': 'Чат с клиентами',
      }[pathname] || 'СуперСТО';
    } else if (isClient) {
      return {
        ...baseTitles,
        '/services': 'Услуги',
        '/appointments': 'Мои записи',
        '/products': 'Продукты',
        '/orders': 'Мои заказы',
        '/chat': 'Чат с мастерами',
      }[pathname] || 'СуперСТО';
    }

    return 'СуперСТО';
  };

  // Мемоизированное содержимое сайдбара
  const siderContent = useMemo(() => (
    <div className="h-full flex flex-col">
      <div className="p-4 text-center border-b border-gray-200">
        <h2 className={`text-xl font-bold text-primary transition-all duration-200 ${collapsed ? 'hidden' : 'block'}`}>
          СуперСТО
        </h2>
        {collapsed && <div className="text-lg font-bold text-primary">СТО</div>}
        {/* Показываем роль пользователя под логотипом */}
        {!collapsed && user && (
          <div className="text-xs text-gray-500 mt-1">
            {user.role === USER_ROLES.ADMIN && 'Администратор'}
            {user.role === USER_ROLES.MASTER && 'Мастер'}
            {user.role === USER_ROLES.CLIENT && 'Клиент'}
          </div>
        )}
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="flex-1 border-r-0"
        inlineCollapsed={collapsed}
      />
    </div>
  ), [collapsed, location.pathname, menuItems, user]);

  const currentPageTitle = getPageTitle(location.pathname);
  const userFullName = user ? getUserFullName(user.firstName, user.lastName) : '';

  return (
    <AntLayout className="min-h-screen">
      {/* Desktop Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="hidden lg:block"
        width={250}
        collapsedWidth={80}
      >
        {siderContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        title="СуперСТО"
        placement="left"
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        className="lg:hidden"
        width={250}
        styles={{ body: { padding: 0 } }}
      >
        {siderContent}
      </Drawer>

      <AntLayout>
        <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={handleMenuToggle}
              className="mr-4"
            />
            <h1 className="text-lg font-semibold text-gray-800 m-0">
              {currentPageTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Badge count={notificationUnreadCount} size="small">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'notifications',
                      label: (
                        <div style={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
                          <div className="p-2 border-b">
                            <strong>Уведомления</strong>
                          </div>
                          <div className="p-2">
                            {/* Здесь будет список уведомлений */}
                            Уведомления скоро появятся...
                          </div>
                        </div>
                      ),
                    },
                  ],
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button
                  type="text"
                  icon={<BellOutlined />}
                />
              </Dropdown>
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                <Avatar icon={<UserOutlined />} />
                <span className="hidden sm:block text-gray-700">
                  {userFullName}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          <div className="animate-fadeIn">
            {children}
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 