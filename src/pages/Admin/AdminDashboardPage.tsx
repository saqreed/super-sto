import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchDashboardStats } from '../../store/slices/analyticsSlice';
import {
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  StarOutlined,
  TeamOutlined
} from '@ant-design/icons';

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { dashboardStats, loading } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardStats() as any);
  }, [dispatch]);

  const topServicesColumns = [
    {
      title: 'Услуга',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Количество',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Доход',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `${(revenue || 0).toLocaleString()} ₽`,
    },
  ];

  const topMastersColumns = [
    {
      title: 'Мастер',
      dataIndex: 'masterName',
      key: 'masterName',
    },
    {
      title: 'Записей',
      dataIndex: 'appointmentCount',
      key: 'appointmentCount',
    },
    {
      title: 'Рейтинг',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating: number) => (
        <div className="flex items-center">
          <StarOutlined className="text-yellow-500 mr-1" />
          {(rating || 0).toFixed(1)}
        </div>
      ),
    },
    {
      title: 'Доход',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `${(revenue || 0).toLocaleString()} ₽`,
    },
  ];

  if (loading || !dashboardStats) {
    return <div>Загрузка...</div>;
  }

  // Безопасные значения по умолчанию
  const stats = {
    totalClients: dashboardStats.totalClients || 0,
    totalMasters: dashboardStats.totalMasters || 0,
    todayAppointments: dashboardStats.todayAppointments || 0,
    monthRevenue: dashboardStats.monthRevenue || 0,
    monthGrowth: dashboardStats.monthGrowth || 0,
    pendingOrders: dashboardStats.pendingOrders || 0,
    lowStockItems: dashboardStats.lowStockItems || 0,
    averageRating: dashboardStats.averageRating || 0,
    topServices: dashboardStats.topServices || [],
    topMasters: dashboardStats.topMasters || [],
  };

  return (
    <div className="space-y-6">
      {/* Основная статистика */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего клиентов"
              value={stats.totalClients}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего мастеров"
              value={stats.totalMasters}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Записей сегодня"
              value={stats.todayAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Доход за месяц"
              value={stats.monthRevenue}
              prefix={<DollarOutlined />}
              suffix="₽"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Дополнительная статистика */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Рост за месяц"
              value={stats.monthGrowth}
              suffix="%"
              valueStyle={{ color: stats.monthGrowth >= 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ожидающие заказы"
              value={stats.pendingOrders}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Товары на исходе"
              value={stats.lowStockItems}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Средний рейтинг"
              value={stats.averageRating}
              prefix={<StarOutlined />}
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Топ услуги */}
        <Col xs={24} lg={12}>
          <Card title="Популярные услуги" className="shadow-sm">
            <Table
              columns={topServicesColumns}
              dataSource={stats.topServices}
              pagination={false}
              size="small"
              rowKey="serviceId"
            />
          </Card>
        </Col>

        {/* Топ мастера */}
        <Col xs={24} lg={12}>
          <Card title="Лучшие мастера" className="shadow-sm">
            <Table
              columns={topMastersColumns}
              dataSource={stats.topMasters}
              pagination={false}
              size="small"
              rowKey="masterId"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardPage; 