import React, { useEffect } from 'react';
import {
  fetchDashboardStats,
  fetchTodayRevenue,
  fetchMonthRevenue,
  fetchTopMasters,
  fetchTopServices,
} from '../../store/slices/analyticsSlice';
import { Card, Row, Col, Statistic, List, Spin, Alert } from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

const AnalyticsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    dashboardStats, 
    revenueStats,
    topServices, 
    topMasters, 
    loading, 
    error 
  } = useAppSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchTodayRevenue());
    dispatch(fetchMonthRevenue());
    dispatch(fetchTopMasters(5));
    dispatch(fetchTopServices(5));
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка загрузки аналитики"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2>Аналитика и статистика</h2>

      {/* Основная статистика */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Всего клиентов"
              value={dashboardStats?.totalClients || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Мастеров"
              value={dashboardStats?.totalMasters || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Записей сегодня"
              value={dashboardStats?.todayAppointments || 0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Доход за месяц"
              value={dashboardStats?.monthRevenue || 0}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="₽"
            />
          </Card>
        </Col>
      </Row>

      {/* Дополнительная статистика */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Рост за месяц"
              value={dashboardStats?.monthGrowth || 0}
              precision={1}
              suffix="%"
              valueStyle={{ 
                color: (dashboardStats?.monthGrowth || 0) > 0 ? '#3f8600' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Заказы в ожидании"
              value={dashboardStats?.pendingOrders || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Мало на складе"
              value={dashboardStats?.lowStockItems || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Средний рейтинг"
              value={dashboardStats?.averageRating || 0}
              precision={1}
              suffix="/5"
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Топ мастера и услуги */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Топ мастера" style={{ height: '400px' }}>
            <List
              itemLayout="horizontal"
              dataSource={topMasters}
              renderItem={(master) => (
                <List.Item>
                  <List.Item.Meta
                    title={master.masterName}
                    description={
                      <div>
                        <div>Выполнено записей: {master.completedAppointments}</div>
                        <div>Доход: {master.revenue}₽</div>
                        <div>Рейтинг: {master.averageRating}/5</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Популярные услуги" style={{ height: '400px' }}>
            <List
              itemLayout="horizontal"
              dataSource={topServices}
              renderItem={(service) => (
                <List.Item>
                  <List.Item.Meta
                    title={service.serviceName}
                    description={
                      <div>
                        <div>Записей: {service.appointmentCount}</div>
                        <div>Доход: {service.revenue}₽</div>
                        <div>Рейтинг: {service.averageRating}/5</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard; 