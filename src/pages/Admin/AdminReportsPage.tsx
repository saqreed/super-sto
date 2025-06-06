import React, { useState } from 'react';
import { Card, DatePicker, Button, Table, message, Row, Col, Statistic } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { reportsAPI } from '../../api/analytics';
import type { Dayjs } from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;

const AdminReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [appointmentsData, setAppointmentsData] = useState<any>(null);
  const [ordersData, setOrdersData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateReports = async () => {
    if (!dateRange) {
      message.error('Выберите период для отчета');
      return;
    }

    setLoading(true);
    try {
      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      };

      const [appointmentsResponse, ordersResponse] = await Promise.all([
        reportsAPI.generateAppointmentsReport(params.startDate, params.endDate),
        reportsAPI.generateOrdersReport(params.startDate, params.endDate),
      ]);

      setAppointmentsData(appointmentsResponse?.data || null);
      setOrdersData(ordersResponse?.data || null);
      message.success('Отчеты сгенерированы успешно');
    } catch (error) {
      message.error('Ошибка генерации отчетов');
      setAppointmentsData(null);
      setOrdersData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
    setDateRange(dates as [Dayjs, Dayjs] | null);
  };

  const appointmentsColumns = [
    { 
      title: 'Дата', 
      dataIndex: 'date', 
      key: 'date',
      render: (date: string) => date || 'Дата не указана',
    },
    { 
      title: 'Количество записей', 
      dataIndex: 'count', 
      key: 'count',
      render: (count: number) => count || 0,
    },
    { 
      title: 'Доход', 
      dataIndex: 'revenue', 
      key: 'revenue', 
      render: (revenue: number) => `${(revenue || 0).toLocaleString()} ₽`,
    },
  ];

  const ordersColumns = [
    { 
      title: 'Дата', 
      dataIndex: 'date', 
      key: 'date',
      render: (date: string) => date || 'Дата не указана',
    },
    { 
      title: 'Количество заказов', 
      dataIndex: 'count', 
      key: 'count',
      render: (count: number) => count || 0,
    },
    { 
      title: 'Сумма заказов', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount', 
      render: (amount: number) => `${(amount || 0).toLocaleString()} ₽`,
    },
  ];

  // Безопасное извлечение данных для таблиц
  const safeAppointmentsDailyData = appointmentsData?.dailyData && Array.isArray(appointmentsData.dailyData) 
    ? appointmentsData.dailyData 
    : [];
    
  const safeOrdersDailyData = ordersData?.dailyData && Array.isArray(ordersData.dailyData) 
    ? ordersData.dailyData 
    : [];

  return (
    <div className="space-y-6">
      <Card title="Генерация отчетов" className="shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD.MM.YYYY"
              placeholder={['Дата начала', 'Дата окончания']}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={generateReports}
              loading={loading}
              disabled={!dateRange}
            >
              Сгенерировать отчеты
            </Button>
          </Col>
        </Row>
      </Card>

      {appointmentsData && (
        <Card title="Отчет по записям" className="shadow-sm">
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={8}>
              <Statistic
                title="Всего записей"
                value={appointmentsData.totalAppointments || 0}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Общий доход"
                value={appointmentsData.totalRevenue || 0}
                suffix="₽"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Средний чек"
                value={appointmentsData.averageRevenue || 0}
                suffix="₽"
                precision={0}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
          </Row>
          <Table
            columns={appointmentsColumns}
            dataSource={safeAppointmentsDailyData}
            pagination={false}
            size="small"
            locale={{ emptyText: 'Нет данных за выбранный период' }}
          />
        </Card>
      )}

      {ordersData && (
        <Card title="Отчет по заказам" className="shadow-sm">
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={8}>
              <Statistic
                title="Всего заказов"
                value={ordersData.totalOrders || 0}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Общая сумма"
                value={ordersData.totalAmount || 0}
                suffix="₽"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Средний заказ"
                value={ordersData.averageOrderAmount || 0}
                suffix="₽"
                precision={0}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
          </Row>
          <Table
            columns={ordersColumns}
            dataSource={safeOrdersDailyData}
            pagination={false}
            size="small"
            locale={{ emptyText: 'Нет данных за выбранный период' }}
          />
        </Card>
      )}
    </div>
  );
};

export default AdminReportsPage; 