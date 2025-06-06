import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Space, Popconfirm, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { servicesAPI } from '../../api/services';
import type { Service } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form] = Form.useForm();

  // Загрузка услуг
  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAll();
      // Безопасная проверка данных
      const servicesData = response?.data;
      if (Array.isArray(servicesData)) {
        setServices(servicesData);
      } else {
        console.warn('Services data is not an array:', servicesData);
        setServices([]);
      }
    } catch (error: any) {
      console.error('Error loading services:', error);
      message.error('Ошибка загрузки услуг: ' + (error?.message || 'Неизвестная ошибка'));
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Сохранение услуги
  const handleSave = async (values: any) => {
    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, values);
        message.success('Услуга обновлена');
      } else {
        await servicesAPI.create(values);
        message.success('Услуга создана');
      }
      setModalVisible(false);
      setEditingService(null);
      form.resetFields();
      loadServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      message.error('Ошибка сохранения: ' + (error?.message || 'Неизвестная ошибка'));
    }
  };

  // Удаление услуги
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Удалить услугу?',
      content: 'Это действие нельзя отменить',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',
      onOk: async () => {
        try {
          await servicesAPI.delete(id);
          message.success('Услуга удалена');
          loadServices();
        } catch (error: any) {
          console.error('Error deleting service:', error);
          message.error('Ошибка удаления: ' + (error?.message || 'Неизвестная ошибка'));
        }
      },
    });
  };

  // Открытие модального окна для редактирования
  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.setFieldsValue(service);
    setModalVisible(true);
  };

  // Открытие модального окна для создания
  const handleAdd = () => {
    setEditingService(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Колонки таблицы
  const columns: ColumnsType<Service> = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || 'Не указано',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text ? (text.length > 100 ? text.substring(0, 100) + '...' : text) : 'Не указано',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price ? `${price.toLocaleString()} ₽` : 'Не указано',
    },
    {
      title: 'Продолжительность',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => duration ? `${duration} мин` : 'Не указано',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => text || 'Не указано',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record: Service) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить услугу?"
            description="Это действие нельзя отменить"
            onConfirm={() => handleDelete(record.id)}
            okText="Удалить"
            cancelText="Отмена"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <h2 className="text-2xl font-bold">Управление услугами</h2>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Добавить услугу
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={Array.isArray(services) ? services : []}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} услуг`,
          }}
          locale={{
            emptyText: 'Нет данных',
          }}
        />
      </Card>

      {/* Модальное окно создания/редактирования */}
      <Modal
        title={editingService ? 'Редактировать услугу' : 'Добавить услугу'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingService(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="Название услуги"
            rules={[{ required: true, message: 'Введите название услуги' }]}
          >
            <Input placeholder="Название услуги" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: 'Введите описание услуги' }]}
          >
            <TextArea rows={4} placeholder="Описание услуги" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Цена (₽)"
                rules={[{ required: true, message: 'Введите цену' }]}
              >
                                 <InputNumber
                   min={0}
                   placeholder="Цена"
                   style={{ width: '100%' }}
                 />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Продолжительность (мин)"
                rules={[{ required: true, message: 'Введите продолжительность' }]}
              >
                <InputNumber
                  min={1}
                  placeholder="Продолжительность в минутах"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="category"
            label="Категория"
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select placeholder="Выберите категорию">
              <Option value="Диагностика">Диагностика</Option>
              <Option value="Ремонт двигателя">Ремонт двигателя</Option>
              <Option value="Электрика">Электрика</Option>
              <Option value="Кузовной ремонт">Кузовной ремонт</Option>
              <Option value="Шиномонтаж">Шиномонтаж</Option>
              <Option value="ТО">Техническое обслуживание</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-2">
              <Button onClick={() => {
                setModalVisible(false);
                setEditingService(null);
                form.resetFields();
              }}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit">
                {editingService ? 'Обновить' : 'Создать'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminServicesPage; 