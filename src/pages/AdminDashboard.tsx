import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchRequests, updateRequestStatus } from '../store/slices/requestsSlice';
import { fetchServices, fetchServiceStations } from '../store/slices/servicesSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { RequestStatus, UserRole } from '../types';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import LoyaltyDashboard from '../components/admin/LoyaltyDashboard';
import { 
  UserIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { requests, loading } = useAppSelector(state => state.requests);
  const { services, serviceStations } = useAppSelector(state => state.services);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchRequests({ userId: user.id, userRole: user.role }));
    }
    dispatch(fetchServices());
    dispatch(fetchServiceStations());
  }, [dispatch, user]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Функции управления
  const handleRequestStatusUpdate = async (requestId: string, newStatus: RequestStatus) => {
    try {
      await dispatch(updateRequestStatus({ requestId, status: newStatus })).unwrap();
      dispatch(addNotification({
        userId: user?.id || '',
        title: 'Статус обновлен',
        message: `Статус заявки #${requestId} изменен на "${getStatusText(newStatus)}"`,
        type: 'success',
        read: false
      }));
    } catch (error) {
      dispatch(addNotification({
        userId: user?.id || '',
        title: 'Ошибка',
        message: 'Не удалось обновить статус заявки',
        type: 'error',
        read: false
      }));
    }
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      dispatch(addNotification({
        userId: user?.id || '',
        title: 'Пользователь удален',
        message: `Пользователь с ID ${userId} был удален`,
        type: 'success',
        read: false
      }));
    }
  };

  // Mock users data (в реальном приложении это будет из API)
  const mockUsers = [
    { id: '1', name: 'Иван Петров', email: 'ivan@example.com', role: UserRole.CLIENT, phone: '+7 (999) 123-45-67', createdAt: new Date('2024-01-15') },
    { id: '2', name: 'Мария Сидорова', email: 'maria@example.com', role: UserRole.CLIENT, phone: '+7 (999) 234-56-78', createdAt: new Date('2024-01-20') },
    { id: '3', name: 'Алексей Мастеров', email: 'master@example.com', role: UserRole.MASTER, phone: '+7 (999) 345-67-89', createdAt: new Date('2024-01-10') },
    { id: '4', name: 'Анна Админова', email: 'admin@example.com', role: UserRole.ADMIN, phone: '+7 (999) 456-78-90', createdAt: new Date('2024-01-05') },
  ];

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case RequestStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case RequestStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case RequestStatus.CANCELLED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return 'Ожидает';
      case RequestStatus.IN_PROGRESS:
        return 'В работе';
      case RequestStatus.COMPLETED:
        return 'Завершено';
      case RequestStatus.CANCELLED:
        return 'Отменено';
      default:
        return status;
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case UserRole.CLIENT:
        return 'Клиент';
      case UserRole.MASTER:
        return 'Мастер';
      case UserRole.ADMIN:
        return 'Администратор';
      default:
        return role;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.CLIENT:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case UserRole.MASTER:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Statistics
  const stats = {
    totalUsers: mockUsers.length,
    totalRequests: requests.length,
    totalServices: services.length,
    totalStations: serviceStations.length,
    pendingRequests: requests.filter(r => r.status === RequestStatus.PENDING).length,
    inProgressRequests: requests.filter(r => r.status === RequestStatus.IN_PROGRESS).length,
    completedRequests: requests.filter(r => r.status === RequestStatus.COMPLETED).length,
    cancelledRequests: requests.filter(r => r.status === RequestStatus.CANCELLED).length,
  };

  // Recent activity
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Доступ запрещен
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            У вас нет прав для доступа к панели администратора
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Панель администратора
      </h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Обзор
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Пользователи
          </button>
          <button
            onClick={() => handleTabChange('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Заявки
          </button>
          <button
            onClick={() => handleTabChange('services')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'services'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Услуги и СТО
          </button>
          <button
            onClick={() => handleTabChange('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Аналитика
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Main Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleTabChange('users')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Пользователи</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div 
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleTabChange('requests')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Заявки</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalRequests}</p>
                </div>
              </div>
            </div>

            <div 
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleTabChange('services')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <WrenchScrewdriverIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Услуги</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalServices}</p>
                </div>
              </div>
            </div>

            <div 
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleTabChange('services')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <WrenchScrewdriverIcon className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">СТО</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalStations}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Status Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div 
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => {
                handleTabChange('requests');
                // В будущем можно добавить фильтрацию по статусу
              }}
            >
              <div className="flex items-center">
                <CalendarDaysIcon className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Ожидают</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.pendingRequests}</p>
                </div>
              </div>
            </div>

            <div 
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => {
                handleTabChange('requests');
                // В будущем можно добавить фильтрацию по статусу
              }}
            >
              <div className="flex items-center">
                <WrenchScrewdriverIcon className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">В работе</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.inProgressRequests}</p>
                </div>
              </div>
            </div>

            <div 
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => {
                handleTabChange('requests');
                // В будущем можно добавить фильтрацию по статусу
              }}
            >
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Завершено</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.completedRequests}</p>
                </div>
              </div>
            </div>

            <div 
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => {
                handleTabChange('requests');
                // В будущем можно добавить фильтрацию по статусу
              }}
            >
              <div className="flex items-center">
                <XCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Отменено</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.cancelledRequests}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Последние заявки
            </h3>
            {recentRequests.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">Нет заявок</p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => handleViewRequest(request)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Заявка #{request.id}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Управление пользователями
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Телефон
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Дата регистрации
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {mockUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.createdAt.toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Все заявки
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : requests.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Нет заявок</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Дата записи
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Создана
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ID: {request.clientId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={request.status}
                          onChange={(e) => handleRequestStatusUpdate(request.id, e.target.value as RequestStatus)}
                          className="text-xs rounded-full border-0 bg-transparent font-medium focus:ring-2 focus:ring-primary-500"
                          style={{ color: 'inherit' }}
                        >
                          <option value={RequestStatus.PENDING}>Ожидает</option>
                          <option value={RequestStatus.IN_PROGRESS}>В работе</option>
                          <option value={RequestStatus.COMPLETED}>Завершено</option>
                          <option value={RequestStatus.CANCELLED}>Отменено</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(request.scheduledDate).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewRequest(request)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-8">
          {/* Services */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Услуги
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200"
                  onClick={() => {
                    dispatch(addNotification({
                      userId: user?.id || '',
                      title: 'Информация об услуге',
                      message: `Просмотр услуги: ${service.name}`,
                      type: 'info',
                      read: false
                    }));
                  }}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {service.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      {service.duration} мин
                    </span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {service.price.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Stations */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              СТО
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceStations.map((station) => (
                <div 
                  key={station.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200"
                  onClick={() => {
                    dispatch(addNotification({
                      userId: user?.id || '',
                      title: 'Информация о СТО',
                      message: `Просмотр СТО: ${station.name}`,
                      type: 'info',
                      read: false
                    }));
                  }}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {station.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {station.address}
                  </p>
                  <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <div>Телефон: {station.phone}</div>
                    <div>Время работы: {station.workingHours.start} - {station.workingHours.end}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <AnalyticsDashboard />
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Заявка #{selectedRequest.id}
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Клиент ID:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">{selectedRequest.clientId}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Статус:</span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusText(selectedRequest.status)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Дата записи:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedRequest.scheduledDate).toLocaleString('ru-RU')}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Описание:</span>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedRequest.description}</p>
                </div>
                {selectedRequest.report && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Отчет мастера:</span>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedRequest.report}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="btn-secondary"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Пользователь: {selectedUser.name}
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Роль:</span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                    {getRoleText(selectedUser.role)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Телефон:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">{selectedUser.phone}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Дата регистрации:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedUser.createdAt.toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="btn-secondary"
                >
                  Закрыть
                </button>
                <button
                  onClick={() => {
                    handleDeleteUser(selectedUser.id);
                    setShowUserModal(false);
                  }}
                  className="btn-danger"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 