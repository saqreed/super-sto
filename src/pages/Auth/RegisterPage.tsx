import React from 'react';
import { Form, Input, Button, Card, Alert, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { register, clearError } from '../../store/slices/authSlice';
import { RegisterRequest } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const onFinish = (values: RegisterRequest) => {
    dispatch(register(values) as any);
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <Title level={2} className="text-primary mb-2">
              СуперСТО
            </Title>
            <Text type="secondary">
              Создайте новый аккаунт
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              closable
              onClose={handleClearError}
              className="mb-4"
            />
          )}

          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="firstName"
              label="Имя"
              rules={[
                { required: true, message: 'Введите имя' },
                { min: 2, message: 'Имя должно содержать минимум 2 символа' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Ваше имя"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Фамилия"
              rules={[
                { required: true, message: 'Введите фамилию' },
                { min: 2, message: 'Фамилия должна содержать минимум 2 символа' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Ваша фамилия"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Введите корректный email' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="your@email.com"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Телефон"
              rules={[
                { required: true, message: 'Введите номер телефона' },
                { pattern: /^\+?[1-9]\d{1,14}$/, message: 'Введите корректный номер телефона' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="+7-900-123-45-67"
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="Роль"
              rules={[{ required: true, message: 'Выберите роль' }]}
              initialValue="CLIENT"
            >
              <Select placeholder="Выберите роль">
                <Option value="CLIENT">Клиент</Option>
                <Option value="MASTER">Мастер</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: 'Введите пароль' },
                { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Ваш пароль"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Подтвердите пароль"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Подтвердите пароль' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Подтвердите пароль"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
              >
                Зарегистрироваться
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Text type="secondary">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-primary hover:text-blue-600">
                Войти
              </Link>
            </Text>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Text type="secondary" className="text-sm">
            © 2024 СуперСТО. Все права защищены.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 