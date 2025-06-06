import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Input, Select, Rate, Badge, InputNumber, Modal, Form, message, Spin, Alert } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchProducts, addToCart, removeFromCart, updateCartQuantity, clearCart, clearError } from '../../store/slices/productsSlice';
import { createOrder } from '../../store/slices/ordersSlice';
import type { Product, CartItem } from '../../types';

const { Option } = Select;
const { Meta } = Card;

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, categories, cart, loading, error } = useSelector((state: RootState) => state.products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cartModal, setCartModal] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  useEffect(() => {
    // Проверяем, что products - это массив
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    dispatch(addToCart({ product, quantity }));
    message.success('Товар добавлен в корзину!');
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    dispatch(updateCartQuantity({ productId, quantity }));
  };

  const getTotalAmount = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total: number, item: CartItem) => total + item.product.price * item.quantity, 0);
  };

  const handleCreateOrder = async (values: any) => {
    try {
      if (!Array.isArray(cart)) {
        message.error('Корзина пуста');
        return;
      }
      
      await dispatch(createOrder({
        items: cart.map((item: CartItem) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        ...values,
      }) as any);

      message.success('Заказ успешно создан!');
      dispatch(clearCart());
      setOrderModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Ошибка при создании заказа');
    }
  };

  // Показываем ошибку, если есть
  if (error) {
    return (
      <Alert
        message="Ошибка загрузки продуктов"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => dispatch(fetchProducts(undefined))}>
            Повторить
          </Button>
        }
      />
    );
  }

  return (
    <Spin spinning={loading}>
      <div className="space-y-6">
        {/* Фильтры и корзина */}
        <Card className="shadow-sm">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Input
                    placeholder="Поиск продуктов..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Select
                    placeholder="Выберите категорию"
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Option value="all">Все категории</Option>
                    {Array.isArray(categories) && categories.map(category => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col>
              <Badge count={Array.isArray(cart) ? cart.length : 0} showZero>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => setCartModal(true)}
                >
                  Корзина
                </Button>
              </Badge>
            </Col>
          </Row>
        </Card>

        {/* Список продуктов */}
        <Row gutter={[16, 16]}>
          {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
              <Card
                hoverable
                cover={
                  product.imageUrl ? (
                    <img alt={product.name} src={product.imageUrl} className="h-48 object-cover" />
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Нет изображения</span>
                    </div>
                  )
                }
                actions={[
                  <Button
                    key="add-to-cart"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockQuantity === 0}
                  >
                    В корзину
                  </Button>
                ]}
              >
                <Meta
                  title={product.name}
                  description={
                    <div className="space-y-2">
                      <p className="text-gray-600">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-600">
                          {product.price.toLocaleString()} ₽
                        </span>
                        <span className={`text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stockQuantity > 0 ? `В наличии: ${product.stockQuantity}` : 'Нет в наличии'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Rate disabled defaultValue={product.rating} allowHalf />
                        <span className="text-gray-500">({product.reviewCount})</span>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Товары не найдены</p>
          </div>
        ) : null}

        {/* Модальное окно корзины */}
        <Modal
          title="Корзина"
          open={cartModal}
          onCancel={() => setCartModal(false)}
          footer={[
            <Button key="close" onClick={() => setCartModal(false)}>
              Закрыть
            </Button>,
            <Button
              key="order"
              type="primary"
              disabled={!Array.isArray(cart) || cart.length === 0}
              onClick={() => {
                setCartModal(false);
                setOrderModal(true);
              }}
            >
              Оформить заказ
            </Button>,
          ]}
        >
          {!Array.isArray(cart) || cart.length === 0 ? (
            <p>Корзина пуста</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item: CartItem) => (
                <div key={item.product.id} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <h4>{item.product.name}</h4>
                    <p className="text-gray-500">{item.product.price.toLocaleString()} ₽</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleUpdateQuantity(item.product.id, value || 1)}
                    />
                    <Button 
                      danger 
                      onClick={() => handleRemoveFromCart(item.product.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-right">
                <h3>Итого: {getTotalAmount().toLocaleString()} ₽</h3>
              </div>
            </div>
          )}
        </Modal>

        {/* Модальное окно оформления заказа */}
        <Modal
          title="Оформление заказа"
          open={orderModal}
          onCancel={() => setOrderModal(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateOrder}>
            <Form.Item
              name="deliveryAddress"
              label="Адрес доставки"
              rules={[{ required: true, message: 'Введите адрес доставки' }]}
            >
              <Input.TextArea rows={3} placeholder="Введите полный адрес доставки" />
            </Form.Item>
            
            <div className="mb-4">
              <h4>Товары в заказе:</h4>
              {Array.isArray(cart) && cart.map((item: CartItem) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{(item.product.price * item.quantity).toLocaleString()} ₽</span>
                </div>
              ))}
              <div className="font-bold text-lg mt-2">
                Итого: {getTotalAmount().toLocaleString()} ₽
              </div>
            </div>

            <Form.Item>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setOrderModal(false)}>
                  Отмена
                </Button>
                <Button type="primary" htmlType="submit">
                  Оформить заказ
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default ProductsPage; 