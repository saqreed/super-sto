import React, { useEffect } from 'react';
import { Table, Tag, Card, Descriptions } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchUserOrders } from '../../store/slices/ordersSlice';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const OrdersPage: React.FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders() as any);
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'orange',
      'CONFIRMED': 'blue',
      'PROCESSING': 'purple',
      'SHIPPED': 'cyan',
      'DELIVERED': 'green',
      'CANCELLED': 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'PENDING': 'Ожидает',
      'CONFIRMED': 'Подтвержден',
      'PROCESSING': 'Обрабатывается',
      'SHIPPED': 'Отправлен',
      'DELIVERED': 'Доставлен',
      'CANCELLED': 'Отменен',
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Номер заказа',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => id ? `#${id.slice(-8)}` : '#N/A',
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        if (!date) return 'Дата не указана';
        try {
          return format(new Date(date), 'dd MMMM yyyy', { locale: ru });
        } catch (error) {
          return 'Некорректная дата';
        }
      },
    },
    {
      title: 'Сумма',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${(amount || 0).toLocaleString()} ₽`,
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
  ];

  const expandedRowRender = (record: any) => (
    <Descriptions title="Детали заказа" bordered size="small">
      <Descriptions.Item label="Адрес доставки" span={3}>
        {record.deliveryAddress || 'Адрес не указан'}
      </Descriptions.Item>
      <Descriptions.Item label="Товары" span={3}>
        <div className="space-y-2">
          {Array.isArray(record.items) && record.items.length > 0 
            ? record.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between">
                <span>{item.productName || 'Без названия'} x {item.quantity || 0}</span>
                <span>{((item.price || 0) * (item.quantity || 0)).toLocaleString()} ₽</span>
              </div>
            ))
            : <span>Товары не указаны</span>
          }
        </div>
      </Descriptions.Item>
    </Descriptions>
  );

  // Безопасное извлечение данных
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <Card title="Мои заказы" className="shadow-sm">
      <Table
        columns={columns}
        dataSource={safeOrders}
        loading={loading}
        rowKey="id"
        expandable={{ expandedRowRender }}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'Нет заказов' }}
      />
    </Card>
  );
};

export default OrdersPage; 