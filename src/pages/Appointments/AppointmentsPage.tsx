import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Card, Modal, message } from 'antd';
import { UserOutlined, FileTextOutlined, ToolOutlined, PlayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchUserAppointments, updateAppointmentStatus } from '../../store/slices/appointmentsSlice';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { USER_ROLES } from '../../types';
import AssignMasterModal from '../../components/AssignMasterModal';
import WorkReportModal from '../../components/WorkReportModal';
import { appointmentsAPI } from '../../api/appointments';

const AppointmentsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state: RootState) => state.appointments);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [assignMasterModalVisible, setAssignMasterModalVisible] = useState(false);
  const [workReportModalVisible, setWorkReportModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');
  const [selectedMasterId, setSelectedMasterId] = useState<string>('');

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isMaster = user?.role === USER_ROLES.MASTER;
  const isClient = user?.role === USER_ROLES.CLIENT;

  useEffect(() => {
    dispatch(fetchUserAppointments() as any);
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'orange',
      'CONFIRMED': 'blue',
      'IN_PROGRESS': 'purple',
      'COMPLETED': 'green',
      'CANCELLED': 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'PENDING': 'Ожидает',
      'CONFIRMED': 'Подтверждена',
      'IN_PROGRESS': 'В процессе',
      'COMPLETED': 'Завершена',
      'CANCELLED': 'Отменена',
    };
    return texts[status] || status;
  };

  const handleCancel = (id: string) => {
    dispatch(updateAppointmentStatus({ id, status: 'CANCELLED' }) as any);
  };

  const handleAssignMaster = (appointmentId: string, currentMasterId?: string) => {
    setSelectedAppointmentId(appointmentId);
    setSelectedMasterId(currentMasterId || '');
    setAssignMasterModalVisible(true);
  };

  const handleStartWork = async (id: string) => {
    try {
      await appointmentsAPI.start(id);
      message.success('Работа начата');
      dispatch(fetchUserAppointments() as any);
    } catch (error) {
      message.error('Ошибка при начале работы');
    }
  };

  const handleCompleteWork = async (id: string) => {
    try {
      await appointmentsAPI.complete(id);
      message.success('Работа завершена');
      dispatch(fetchUserAppointments() as any);
    } catch (error) {
      message.error('Ошибка при завершении работы');
    }
  };

  const handleCreateWorkReport = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setWorkReportModalVisible(true);
  };

  const handleConfirmAppointment = async (id: string) => {
    try {
      await appointmentsAPI.confirm(id);
      message.success('Запись подтверждена');
      dispatch(fetchUserAppointments() as any);
    } catch (error) {
      message.error('Ошибка при подтверждении записи');
    }
  };

  const getPageTitle = () => {
    if (isAdmin) return 'Все записи';
    if (isMaster) return 'Мои записи';
    return 'Мои записи';
  };

  const columns = [
    {
      title: 'Услуга',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: (serviceName: string) => serviceName || 'Без названия',
    },
    ...(isClient ? [{
      title: 'Мастер',
      dataIndex: 'masterName',
      key: 'masterName',
      render: (masterName: string) => masterName || 'Не назначен',
    }] : []),
    ...(isAdmin ? [{
      title: 'Клиент',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (clientName: string) => clientName || 'Неизвестен',
    }] : []),
    ...(isAdmin ? [{
      title: 'Мастер',
      dataIndex: 'masterName',
      key: 'masterName',
      render: (masterName: string) => masterName || 'Не назначен',
    }] : []),
    {
      title: 'Дата и время',
      dataIndex: 'appointmentDateTime',
      key: 'appointmentDateTime',
      render: (date: string) => {
        if (!date) return 'Дата не указана';
        try {
          return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: ru });
        } catch (error) {
          return 'Некорректная дата';
        }
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {/* Действия для администратора */}
          {isAdmin && (
            <>
              {(record.status === 'PENDING' || !record.masterId) && (
                <Button 
                  size="small" 
                  icon={<UserOutlined />}
                  onClick={() => handleAssignMaster(record.id, record.masterId)}
                >
                  {record.masterId ? 'Изменить мастера' : 'Назначить мастера'}
                </Button>
              )}
              {record.status === 'PENDING' && (
                <Button 
                  size="small" 
                  type="primary"
                  onClick={() => handleConfirmAppointment(record.id)}
                >
                  Подтвердить
                </Button>
              )}
            </>
          )}

          {/* Действия для мастера */}
          {isMaster && (
            <>
              {record.status === 'CONFIRMED' && (
                <Button 
                  size="small" 
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleStartWork(record.id)}
                >
                  Начать работу
                </Button>
              )}
              {record.status === 'IN_PROGRESS' && (
                <>
                  <Button 
                    size="small" 
                    icon={<FileTextOutlined />}
                    onClick={() => handleCreateWorkReport(record.id)}
                  >
                    Отчет о работе
                  </Button>
                  <Button 
                    size="small" 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleCompleteWork(record.id)}
                  >
                    Завершить
                  </Button>
                </>
              )}
              {record.status === 'COMPLETED' && record.workReport && (
                <Button 
                  size="small" 
                  icon={<FileTextOutlined />}
                  onClick={() => handleCreateWorkReport(record.id)}
                >
                  Редактировать отчет
                </Button>
              )}
            </>
          )}

          {/* Действия для клиента */}
          {isClient && record.status === 'PENDING' && (
            <Button size="small" danger onClick={() => handleCancel(record.id)}>
              Отменить
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Безопасное извлечение данных
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  return (
    <>
      <Card title={getPageTitle()} className="shadow-sm">
        <Table
          columns={columns}
          dataSource={safeAppointments}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Нет записей' }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Модальное окно назначения мастера (для админа) */}
      <AssignMasterModal
        visible={assignMasterModalVisible}
        appointmentId={selectedAppointmentId}
        currentMasterId={selectedMasterId}
        onCancel={() => setAssignMasterModalVisible(false)}
        onSuccess={() => {
          setAssignMasterModalVisible(false);
          dispatch(fetchUserAppointments() as any);
        }}
      />

      {/* Модальное окно отчета о работе (для мастера) */}
      <WorkReportModal
        visible={workReportModalVisible}
        appointmentId={selectedAppointmentId}
        onCancel={() => setWorkReportModalVisible(false)}
        onSuccess={() => {
          setWorkReportModalVisible(false);
          dispatch(fetchUserAppointments() as any);
        }}
      />
    </>
  );
};

export default AppointmentsPage; 