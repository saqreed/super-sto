import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  message, 
  Table, 
  Select, 
  InputNumber, 
  Space, 
  Divider,
  Card,
  Row,
  Col,
  Typography,
  Upload,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  UploadOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { appointmentsAPI } from '../api/appointments';
import { productsAPI } from '../api/products';
import type { CreateWorkReportRequest, Product, UsedPart, WorkReport } from '../types';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface WorkReportModalProps {
  visible: boolean;
  appointmentId: string;
  existingReport?: WorkReport;
  onCancel: () => void;
  onSuccess: () => void;
}

interface UsedPartForm {
  key: string;
  productId: string;
  quantity: number;
}

const WorkReportModal: React.FC<WorkReportModalProps> = ({
  visible,
  appointmentId,
  existingReport,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [usedParts, setUsedParts] = useState<UsedPartForm[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  // Загрузка продуктов при открытии модала
  useEffect(() => {
    if (visible) {
      loadProducts();
      if (existingReport) {
        loadExistingReport();
      }
    }
  }, [visible, existingReport]);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productsAPI.getAll();
      const productsData = response.data.data || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      message.error('Ошибка загрузки каталога деталей');
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadExistingReport = () => {
    if (existingReport) {
      form.setFieldsValue({
        description: existingReport.description,
        laborTime: existingReport.laborTime,
        additionalCosts: existingReport.additionalCosts,
        recommendations: existingReport.recommendations,
      });

      // Загружаем использованные детали
      const existingParts = existingReport.usedParts.map((part, index) => ({
        key: `existing_${index}`,
        productId: part.productId,
        quantity: part.quantity,
      }));
      setUsedParts(existingParts);
    }
  };

  const addUsedPart = () => {
    const newPart: UsedPartForm = {
      key: `new_${Date.now()}`,
      productId: '',
      quantity: 1,
    };
    setUsedParts([...usedParts, newPart]);
  };

  const removeUsedPart = (key: string) => {
    setUsedParts(usedParts.filter(part => part.key !== key));
  };

  const updateUsedPart = (key: string, field: string, value: any) => {
    setUsedParts(usedParts.map(part => 
      part.key === key ? { ...part, [field]: value } : part
    ));
  };

  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const calculatePartTotal = (productId: string, quantity: number) => {
    const product = getProductDetails(productId);
    return product ? product.price * quantity : 0;
  };

  const calculateTotalCost = () => {
    const partsTotal = usedParts.reduce((sum, part) => {
      return sum + calculatePartTotal(part.productId, part.quantity);
    }, 0);
    const additionalCosts = form.getFieldValue('additionalCosts') || 0;
    return partsTotal + additionalCosts;
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Валидация использованных деталей
      const validParts = usedParts.filter(part => part.productId && part.quantity > 0);
      
      const data: CreateWorkReportRequest = {
        appointmentId,
        description: values.description,
        usedParts: validParts.map(part => ({
          productId: part.productId,
          quantity: part.quantity,
        })),
        laborTime: values.laborTime,
        additionalCosts: values.additionalCosts || 0,
        recommendations: values.recommendations,
        photos: fileList.map(file => file.response?.url || file.url).filter(Boolean),
      };

      if (existingReport) {
        await appointmentsAPI.updateWorkReport(appointmentId, data);
        message.success('Отчет о работе обновлен');
      } else {
        await appointmentsAPI.createWorkReport(data);
        message.success('Отчет о работе создан');
      }
      
      handleCancel();
      onSuccess();
    } catch (error: any) {
      console.error('Ошибка сохранения отчета:', error);
      message.error(error.response?.data?.message || 'Ошибка сохранения отчета');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setUsedParts([]);
    setFileList([]);
    onCancel();
  };

  // Колонки таблицы использованных деталей
  const usedPartsColumns = [
    {
      title: 'Деталь',
      dataIndex: 'productId',
      key: 'productId',
      width: '40%',
      render: (productId: string, record: UsedPartForm) => (
        <Select
          placeholder="Выберите деталь"
          value={productId}
          onChange={(value) => updateUsedPart(record.key, 'productId', value)}
          loading={productsLoading}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
        >
          {products.map((product) => (
            <Select.Option key={product.id} value={product.id}>
              {product.name} - {product.price}₽
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '20%',
      render: (quantity: number, record: UsedPartForm) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateUsedPart(record.key, 'quantity', value || 1)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Цена за ед.',
      key: 'unitPrice',
      width: '20%',
      render: (_: any, record: UsedPartForm) => {
        const product = getProductDetails(record.productId);
        return product ? `${product.price}₽` : '—';
      },
    },
    {
      title: 'Сумма',
      key: 'total',
      width: '15%',
      render: (_: any, record: UsedPartForm) => {
        const total = calculatePartTotal(record.productId, record.quantity);
        return `${total}₽`;
      },
    },
    {
      title: '',
      key: 'actions',
      width: '5%',
      render: (_: any, record: UsedPartForm) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeUsedPart(record.key)}
          size="small"
        />
      ),
    },
  ];

  return (
    <Modal
      title={existingReport ? "Редактировать отчет о работе" : "Создать отчет о работе"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Описание выполненной работы"
              rules={[{ required: true, message: 'Опишите выполненную работу' }]}
            >
              <TextArea
                placeholder="Подробно опишите что было сделано..."
                rows={4}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">
          <Space>
            <ShoppingCartOutlined />
            Использованные детали
          </Space>
        </Divider>

        <Card size="small" className="mb-4">
          <Table
            dataSource={usedParts}
            columns={usedPartsColumns}
            pagination={false}
            size="small"
            locale={{ emptyText: 'Детали не добавлены' }}
          />
          
          <Button
            type="dashed"
            onClick={addUsedPart}
            icon={<PlusOutlined />}
            style={{ width: '100%', marginTop: 8 }}
          >
            Добавить деталь
          </Button>
        </Card>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="laborTime"
              label={
                <Space>
                  <ClockCircleOutlined />
                  Время работы (мин)
                </Space>
              }
              rules={[{ required: true, message: 'Укажите время работы' }]}
            >
              <InputNumber
                min={1}
                placeholder="120"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="additionalCosts"
              label={
                <Space>
                  <DollarOutlined />
                  Доп. расходы (₽)
                </Space>
              }
            >
              <InputNumber
                min={0}
                placeholder="0"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Text strong>Общая стоимость:</Text>
              <br />
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                {calculateTotalCost()}₽
              </Title>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="recommendations"
              label="Рекомендации клиенту"
            >
              <TextArea
                placeholder="Рекомендации по дальнейшему обслуживанию, замене деталей и т.д."
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mb-0 text-right">
          <Space>
            <Button onClick={handleCancel}>
              Отмена
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              {existingReport ? 'Обновить отчет' : 'Создать отчет'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WorkReportModal; 