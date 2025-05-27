import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchRequests } from '../store/slices/requestsSlice';
import { fetchNotifications, markAsReadAsync, markAllAsReadAsync } from '../store/slices/notificationsSlice';
import { updateProfile } from '../store/slices/authSlice';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { RequestStatus } from '../types';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { requests, loading: requestsLoading } = useAppSelector(state => state.requests);
  const { notifications, unreadCount } = useAppSelector(state => state.notifications);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchRequests({ userId: user.id, userRole: user.role }));
      dispatch(fetchNotifications(user.id));
    }
  }, [dispatch, user]);

  const handleUpdateProfile = () => {
    if (user) {
      dispatch(updateProfile(editForm));
      setIsEditing(false);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsReadAsync(notificationId));
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      dispatch(markAllAsReadAsync(user.id));
    }
  };

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Личный кабинет
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Войдите в аккаунт для доступа к личному кабинету
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Личный кабинет
      </h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Профиль
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Мои заявки
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
              activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Уведомления
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Информация о профиле
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              {isEditing ? 'Отмена' : 'Редактировать'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-3">
                <button onClick={handleUpdateProfile} className="btn-primary">
                  Сохранить
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Имя</div>
                  <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                </div>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                  <div className="font-medium text-gray-900 dark:text-white">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Телефон</div>
                  <div className="font-medium text-gray-900 dark:text-white">{user.phone || 'Не указан'}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Роль</div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.role === 'client' ? 'Клиент' : user.role === 'master' ? 'Мастер' : 'Администратор'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : user.role === 'master'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {user.role === 'client' ? 'Клиент' : user.role === 'master' ? 'Мастер' : 'Администратор'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions for Masters and Admins */}
          {!isEditing && (user.role === 'master' || user.role === 'admin') && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Быстрые действия
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.role === 'master' && (
                  <Link
                    to="/master"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Панель мастера
                  </Link>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Панель администратора
                    </Link>
                    <Link
                      to="/master"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Панель мастера
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {requestsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="card p-6 text-center">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Нет заявок
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                У вас пока нет заявок на обслуживание
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Заявка #{request.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Создана: {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Дата и время</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(request.scheduledDate).toLocaleDateString('ru-RU')} в{' '}
                      {new Date(request.scheduledDate).toLocaleTimeString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Последнее обновление</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(request.updatedAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>

                {request.description && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Описание</div>
                    <div className="text-gray-900 dark:text-white">{request.description}</div>
                  </div>
                )}

                {request.report && (
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                      Отчет мастера
                    </div>
                    <div className="text-green-700 dark:text-green-300">{request.report}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Уведомления
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Отметить все как прочитанные
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="card p-6 text-center">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Нет уведомлений
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                У вас пока нет уведомлений
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`card p-4 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700' : ''
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                          {new Date(notification.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 