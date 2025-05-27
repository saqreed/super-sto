import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchRequests, updateRequestStatus } from '../store/slices/requestsSlice';
import { fetchServices, fetchServiceStations } from '../store/slices/servicesSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { RequestStatus } from '../types';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  WrenchScrewdriverIcon,
  FunnelIcon,
  CalendarDaysIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const MasterDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { requests, loading } = useAppSelector(state => state.requests);
  const { services, serviceStations } = useAppSelector(state => state.services);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRequestForReport, setSelectedRequestForReport] = useState<any>(null);
  const [reportText, setReportText] = useState('');
  const [showRequestDetailModal, setShowRequestDetailModal] = useState(false);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<any>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchRequests({ userId: user.id, userRole: user.role }));
    }
    dispatch(fetchServices());
    dispatch(fetchServiceStations());
  }, [dispatch, user]);

  const handleStatusUpdate = async (requestId: string, newStatus: RequestStatus) => {
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

  const handleCompleteWithReport = (request: any) => {
    setSelectedRequestForReport(request);
    setReportText('');
    setShowReportModal(true);
  };

  const handleViewRequestDetail = (request: any) => {
    setSelectedRequestForDetail(request);
    setShowRequestDetailModal(true);
  };

  const handleSubmitReport = async () => {
    if (!selectedRequestForReport || !reportText.trim()) {
      return;
    }

    try {
      // В реальном приложении здесь будет API вызов для сохранения отчета
      await dispatch(updateRequestStatus({ 
        requestId: selectedRequestForReport.id, 
        status: RequestStatus.COMPLETED 
      })).unwrap();

      dispatch(addNotification({
        userId: user?.id || '',
        title: 'Работа завершена',
        message: `Заявка #${selectedRequestForReport.id} завершена с отчетом`,
        type: 'success',
        read: false
      }));

      setShowReportModal(false);
      setSelectedRequestForReport(null);
      setReportText('');
    } catch (error) {
      dispatch(addNotification({
        userId: user?.id || '',
        title: 'Ошибка',
        message: 'Не удалось завершить заявку',
        type: 'error',
        read: false
      }));
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

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return <ClockIcon className="h-5 w-5" />;
      case RequestStatus.IN_PROGRESS:
        return <WrenchScrewdriverIcon className="h-5 w-5" />;
      case RequestStatus.COMPLETED:
        return <CheckCircleIcon className="h-5 w-5" />;
      case RequestStatus.CANCELLED:
        return <XCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Неизвестная услуга';
  };

  const getStationName = (stationId: string) => {
    const station = serviceStations.find(s => s.id === stationId);
    return station?.name || 'Неизвестное СТО';
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === 'all' || request.status === statusFilter
  );

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === RequestStatus.PENDING).length,
    inProgress: requests.filter(r => r.status === RequestStatus.IN_PROGRESS).length,
    completed: requests.filter(r => r.status === RequestStatus.COMPLETED).length,
  };

  if (user?.role !== 'master' && user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Доступ запрещен
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            У вас нет прав для доступа к панели мастера
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Панель мастера
        </h1>
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
            className="input-field"
          >
            <option value="all">Все заявки</option>
            <option value={RequestStatus.PENDING}>Ожидающие</option>
            <option value={RequestStatus.IN_PROGRESS}>В работе</option>
            <option value={RequestStatus.COMPLETED}>Завершенные</option>
            <option value={RequestStatus.CANCELLED}>Отмененные</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => setStatusFilter('all')}
        >
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Всего заявок</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div 
          className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => setStatusFilter(RequestStatus.PENDING)}
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Ожидают</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div 
          className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => setStatusFilter(RequestStatus.IN_PROGRESS)}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">В работе</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div 
          className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => setStatusFilter(RequestStatus.COMPLETED)}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Завершено</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="card p-6 text-center">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Нет заявок
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {statusFilter === 'all' ? 'Заявки отсутствуют' : `Нет заявок со статусом "${getStatusText(statusFilter as RequestStatus)}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="flex items-start space-x-4 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  onClick={() => handleViewRequestDetail(request)}
                >
                  <div className={`p-2 rounded-lg ${getStatusColor(request.status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                    {getStatusIcon(request.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Заявка #{request.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getServiceName(request.serviceId)} • {getStationName(request.serviceStationId)}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Клиент</div>
                  <div className="font-medium text-gray-900 dark:text-white flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    ID: {request.clientId}
                  </div>
                </div>
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
                  <div className="text-sm text-gray-500 dark:text-gray-400">Создана</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>

              {request.description && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Описание проблемы</div>
                  <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {request.description}
                  </div>
                </div>
              )}

              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-2">
                {request.status === RequestStatus.PENDING && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(request.id, RequestStatus.IN_PROGRESS)}
                      className="btn-primary text-sm"
                    >
                      Принять в работу
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, RequestStatus.CANCELLED)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded text-sm"
                    >
                      Отклонить
                    </button>
                  </>
                )}
                
                {request.status === RequestStatus.IN_PROGRESS && (
                  <>
                    <button
                      onClick={() => handleCompleteWithReport(request)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded text-sm"
                    >
                      Завершить с отчетом
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, RequestStatus.CANCELLED)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded text-sm"
                    >
                      Отменить
                    </button>
                  </>
                )}

                {request.status === RequestStatus.COMPLETED && (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ Работа завершена
                  </span>
                )}

                {request.status === RequestStatus.CANCELLED && (
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                    ✗ Заявка отменена
                  </span>
                )}
              </div>

              {request.report && (
                <div className="mt-4 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                    Отчет о выполненной работе
                  </div>
                  <div className="text-green-700 dark:text-green-300">{request.report}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && selectedRequestForReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Отчет по заявке #{selectedRequestForReport.id}
              </h3>
              <div className="mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Услуга: {getServiceName(selectedRequestForReport.serviceId)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Описание проблемы: {selectedRequestForReport.description}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Отчет о выполненной работе *
                </label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  rows={5}
                  className="input-field"
                  placeholder="Опишите выполненные работы, замененные детали, рекомендации..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedRequestForReport(null);
                    setReportText('');
                  }}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={!reportText.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Завершить работу
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Detail Modal */}
      {showRequestDetailModal && selectedRequestForDetail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Детали заявки #{selectedRequestForDetail.id}
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Услуга:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {getServiceName(selectedRequestForDetail.serviceId)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">СТО:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {getStationName(selectedRequestForDetail.serviceStationId)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Клиент ID:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">{selectedRequestForDetail.clientId}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Статус:</span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequestForDetail.status)}`}>
                    {getStatusText(selectedRequestForDetail.status)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Дата записи:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedRequestForDetail.scheduledDate).toLocaleString('ru-RU')}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Создана:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedRequestForDetail.createdAt).toLocaleString('ru-RU')}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Описание:</span>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    {selectedRequestForDetail.description}
                  </p>
                </div>
                {selectedRequestForDetail.report && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Отчет мастера:</span>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white bg-green-50 dark:bg-green-900 p-2 rounded">
                      {selectedRequestForDetail.report}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setShowRequestDetailModal(false);
                    setSelectedRequestForDetail(null);
                  }}
                  className="btn-secondary"
                >
                  Закрыть
                </button>
                {selectedRequestForDetail.status === RequestStatus.PENDING && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedRequestForDetail.id, RequestStatus.IN_PROGRESS);
                      setShowRequestDetailModal(false);
                      setSelectedRequestForDetail(null);
                    }}
                    className="btn-primary"
                  >
                    Принять в работу
                  </button>
                )}
                {selectedRequestForDetail.status === RequestStatus.IN_PROGRESS && (
                  <button
                    onClick={() => {
                      setShowRequestDetailModal(false);
                      handleCompleteWithReport(selectedRequestForDetail);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    Завершить
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDashboard; 