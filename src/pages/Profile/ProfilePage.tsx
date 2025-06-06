import React from 'react';
import { Card, Form, Input, Button, message, Tag, Descriptions } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateProfile } from '../../store/slices/authSlice';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();

  const handleUpdateProfile = async (values: any) => {
    try {
      await dispatch(updateProfile(values) as any);
      message.success('Профиль успешно обновлен!');
    } catch (error) {
      message.error('Ошибка обновления профиля');
    }
  };

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      'CLIENT': 'Клиент',
      'MASTER': 'Мастер',
      'ADMIN': 'Администратор',
    };
    return roleNames[role] || role;
  };

  const getLoyaltyLevelName = (level?: string) => {
    if (!level) return 'Не определен';
    const levelNames: Record<string, string> = {
      'BRONZE': 'Бронзовый',
      'SILVER': 'Серебряный',
      'GOLD': 'Золотой',
      'PLATINUM': 'Платиновый',
    };
    return levelNames[level] || level;
  };

  const getLoyaltyColor = (level?: string) => {
    const colors: Record<string, string> = {
      'BRONZE': 'orange',
      'SILVER': 'default',
      'GOLD': 'gold',
      'PLATINUM': 'purple',
    };
    return colors[level || ''] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Информация о профиле */}
      <Card title="Информация о профиле" className="shadow-sm">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Email">
            {user?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Роль">
            <Tag color="blue">{getRoleName(user?.role || '')}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Статус">
            <Tag color={user?.isActive ? 'green' : 'red'}>
              {user?.isActive ? 'Активен' : 'Неактивен'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Дата регистрации">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Не указана'}
          </Descriptions.Item>
          {user?.loyaltyLevel && (
            <>
              <Descriptions.Item label="Уровень лояльности">
                <Tag color={getLoyaltyColor(user.loyaltyLevel)}>
                  {getLoyaltyLevelName(user.loyaltyLevel)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Баллы лояльности">
                {user.loyaltyPoints || 0}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Card>

      {/* Редактирование профиля */}
      <Card title="Редактировать профиль" className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            firstName: user?.firstName,
            lastName: user?.lastName,
            phone: user?.phone,
          }}
          onFinish={handleUpdateProfile}
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              Сохранить изменения
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage; 