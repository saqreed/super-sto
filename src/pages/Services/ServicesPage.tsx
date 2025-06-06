import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Input, Select, Rate, Tag, Modal, Form, DatePicker, message } from 'antd';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchServices, fetchCategories } from '../../store/slices/servicesSlice';
import { createAppointment } from '../../store/slices/appointmentsSlice';
import { usersAPI } from '../../api/users';
import { Service, User } from '../../types';
import dayjs from 'dayjs';

const { Option } = Select;
const { Meta } = Card;

const ServicesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { services, categories } = useSelector((state: RootState) => state.services);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [masters, setMasters] = useState<User[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchServices() as any);
    dispatch(fetchCategories() as any);
    loadMasters();
  }, [dispatch]);

  useEffect(() => {
    let filtered = services;
    
    if (searchText) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchText.toLowerCase()) ||
        service.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    setFilteredServices(filtered);
  }, [services, searchText, selectedCategory]);

  const loadMasters = async () => {
    try {
      const response = await usersAPI.getMasters();
      setMasters(response.data);
    } catch (error) {
      console.error('Ошибка загрузки мастеров:', error);
    }
  };

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setAppointmentModal(true);
  };

  const handleCreateAppointment = async (values: any) => {
    try {
      await dispatch(createAppointment({
        serviceId: selectedService!.id,
        masterId: values.masterId,
        appointmentDateTime: values.appointmentDateTime.toISOString(),
        notes: values.notes,
      }) as any);
      
      message.success('Запись успешно создана!');
      setAppointmentModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Ошибка создания записи');
    }
  };

  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'MAINTENANCE': 'Обслуживание',
      'REPAIR': 'Ремонт',
      'BODY_WORK': 'Кузовные работы',
      'DIAGNOSTIC': 'Диагностика',
      'DETAILING': 'Детейлинг',
    };
    return categoryNames[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <Card className="shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Поиск услуг..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Выберите категорию"
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
              style={{ width: '100%' }}
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {getCategoryName(category)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Список услуг */}
      <Row gutter={[16, 16]}>
        {filteredServices.map((service) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={service.id}>
            <Card
              hoverable
              actions={[
                <Button
                  type="primary"
                  icon={<CalendarOutlined />}
                  onClick={() => handleBookService(service)}
                >
                  Записаться
                </Button>
              ]}
              className="h-full"
            >
              <Meta
                title={
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-semibold">{service.name}</span>
                    <Tag color="blue">{getCategoryName(service.category)}</Tag>
                  </div>
                }
                description={
                  <div className="space-y-2">
                    <p className="text-gray-600">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600">
                        {service.price.toLocaleString()} ₽
                      </span>
                      <span className="text-gray-500">
                        {service.duration} мин
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Rate disabled defaultValue={service.rating} allowHalf />
                      <span className="text-gray-500">({service.reviewCount})</span>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Модальное окно записи */}
      <Modal
        title={`Запись на услугу: ${selectedService?.name}`}
        open={appointmentModal}
        onCancel={() => setAppointmentModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateAppointment}
        >
          <Form.Item
            name="masterId"
            label="Выберите мастера"
            rules={[{ required: true, message: 'Выберите мастера' }]}
          >
            <Select placeholder="Выберите мастера">
              {masters.map(master => (
                <Option key={master.id} value={master.id}>
                  {master.firstName} {master.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="appointmentDateTime"
            label="Дата и время"
            rules={[{ required: true, message: 'Выберите дату и время' }]}
          >
            <DatePicker
              showTime
              format="DD.MM.YYYY HH:mm"
              placeholder="Выберите дату и время"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Дополнительные пожелания"
          >
            <Input.TextArea
              rows={3}
              placeholder="Опишите ваши пожелания или особенности..."
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setAppointmentModal(false)}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit">
                Записаться
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServicesPage; 