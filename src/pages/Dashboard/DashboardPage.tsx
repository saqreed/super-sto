import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, List, Avatar, Tag, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CalendarOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { RootState } from '../../store/store';
import { fetchUserAppointments } from '../../store/slices/appointmentsSlice';
import { fetchUserOrders } from '../../store/slices/ordersSlice';
import { fetchDashboardStats } from '../../store/slices/analyticsSlice';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { orders } = useSelector((state: RootState) => state.orders);
  const { unreadCount } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    dispatch(fetchUserAppointments() as any);
    dispatch(fetchUserOrders() as any);
    dispatch(fetchDashboardStats() as any);
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'CONFIRMED': return 'blue';
      case 'IN_PROGRESS': return 'purple';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Ожидает';
      case 'CONFIRMED': return 'Подтверждена';
      case 'IN_PROGRESS': return 'В процессе';
      case 'COMPLETED': return 'Завершена';
      case 'CANCELLED': return 'Отменена';
      default: return status;
    }
  };

  // Безопасное извлечение данных с проверками на массивы
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  
  const recentAppointments = safeAppointments.slice(0, 5);
  const recentOrders = safeOrders.slice(0, 5);

  const pendingAppointments = safeAppointments.filter(app => app.status === 'PENDING').length;
  const completedAppointments = safeAppointments.filter(app => app.status === 'COMPLETED').length;
  const activeOrders = safeOrders.filter(order => ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)).length;

  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Title level={2} className="mb-2">
          Добро пожаловать, {user?.firstName || 'Пользователь'}!
        </Title>
        <Text type="secondary" className="text-lg">
          Вот краткий обзор вашей активности в СуперСТО
        </Text>
      </div>

      {/* Статистика */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ожидающие записи"
              value={pendingAppointments}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Завершенные записи"
              value={completedAppointments}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Активные заказы"
              value={activeOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Непрочитанные сообщения"
              value={unreadCount || 0}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Быстрые действия */}
      <Card title="Быстрые действия" className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              block
              onClick={() => navigate('/services')}
            >
              Записаться на услугу
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button
              icon={<ShoppingCartOutlined />}
              size="large"
              block
              onClick={() => navigate('/products')}
            >
              Купить продукты
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button
              icon={<MessageOutlined />}
              size="large"
              block
              onClick={() => navigate('/chat')}
            >
              Открыть чат
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Последние записи */}
        <Col xs={24} lg={12}>
          <Card
            title="Последние записи"
            extra={
              <Button type="link" onClick={() => navigate('/appointments')}>
                Все записи
              </Button>
            }
            className="shadow-sm"
          >
            <List
              dataSource={recentAppointments}
              renderItem={(appointment) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<CalendarOutlined />} />}
                    title={
                      <div className="flex justify-between items-center">
                        <span>{appointment.serviceName || 'Без названия'}</span>
                        <Tag color={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>Мастер: {appointment.masterName || 'Не назначен'}</div>
                        <div>
                          {appointment.appointmentDateTime 
                            ? format(new Date(appointment.appointmentDateTime), 'dd MMMM yyyy, HH:mm', { locale: ru })
                            : 'Дата не указана'
                          }
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'Нет записей' }}
            />
          </Card>
        </Col>

        {/* Последние заказы */}
        <Col xs={24} lg={12}>
          <Card
            title="Последние заказы"
            extra={
              <Button type="link" onClick={() => navigate('/orders')}>
                Все заказы
              </Button>
            }
            className="shadow-sm"
          >
            <List
              dataSource={recentOrders}
              renderItem={(order) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<ShoppingCartOutlined />} />}
                    title={
                      <div className="flex justify-between items-center">
                        <span>Заказ #{order.id ? order.id.slice(-8) : 'N/A'}</span>
                        <Tag color={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>Сумма: {(order.totalAmount || 0).toLocaleString()} ₽</div>
                        <div>
                          {order.createdAt 
                            ? format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: ru })
                            : 'Дата не указана'
                          }
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'Нет заказов' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 