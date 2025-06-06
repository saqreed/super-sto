import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/slices/authSlice';
import { LoginRequest } from '../../types';
import { isValidEmail } from '../../utils';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Перенаправление после успешного логина
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ Login successful, redirecting to dashboard...');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = useCallback((values: LoginRequest) => {
    dispatch(login(values));
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Кастомная валидация email
  const validateEmail = useCallback((_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Введите email'));
    }
    if (!isValidEmail(value)) {
      return Promise.reject(new Error('Введите корректный email'));
    }
    return Promise.resolve();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <Card className="shadow-lg hover-lift">
          <div className="text-center mb-8">
            <Title level={2} className="text-primary mb-2">
              СуперСТО
            </Title>
            <Text type="secondary">
              Войдите в свой аккаунт
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              closable
              onClose={handleClearError}
              className="mb-4 animate-slideInRight"
            />
          )}

          <Form
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ validator: validateEmail }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="your@email.com"
                autoComplete="email"
                className="transition-all"
              />
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
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Ваш пароль"
                autoComplete="current-password"
                className="transition-all"
              />
            </Form.Item>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                className="w-full h-12 text-base font-medium bg-gradient-primary border-0 hover-scale"
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Text type="secondary">
              Нет аккаунта?{' '}
              <Link 
                to="/register" 
                className="text-primary hover:text-blue-600 transition-colors font-medium"
              >
                Зарегистрироваться
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

export default LoginPage; 