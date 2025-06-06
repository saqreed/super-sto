import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Tag, message, Space, Select } from 'antd';
import { usersAPI } from '../../api/users';
import type { User } from '../../types';

const { Option } = Select;

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getAllUsers();
      // Правильное извлечение данных из обернутого ответа
      const userData = response?.data?.data; // API возвращает {data: {data: Array(...)}}
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else {
        setUsers([]);
        console.warn('Некорректный формат данных пользователей:', response?.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      message.error('Ошибка загрузки пользователей');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleStatus = async (userId: string) => {
    if (!userId) {
      message.error('Некорректный ID пользователя');
      return;
    }
    
    try {
      await usersAPI.toggleUserStatus(userId);
      message.success('Статус пользователя изменен');
      loadUsers();
    } catch (error) {
      message.error('Ошибка изменения статуса');
    }
  };

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      'CLIENT': 'Клиент',
      'MASTER': 'Мастер',
      'ADMIN': 'Администратор',
    };
    return roleNames[role] || role || 'Неизвестно';
  };

  const columns = [
    {
      title: 'Имя',
      key: 'name',
      render: (record: User) => {
        const firstName = record?.firstName || '';
        const lastName = record?.lastName || '';
        return `${firstName} ${lastName}`.trim() || 'Не указано';
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || 'Не указан',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || 'Не указан',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'red' : role === 'MASTER' ? 'blue' : 'green'}>
          {getRoleName(role)}
        </Tag>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Активен' : 'Неактивен'}
        </Tag>
      ),
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        if (!date) return 'Дата не указана';
        try {
          return new Date(date).toLocaleDateString('ru-RU');
        } catch (error) {
          return 'Некорректная дата';
        }
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            size="small"
            type={record.isActive ? 'default' : 'primary'}
            onClick={() => handleToggleStatus(record.id)}
            disabled={!record.id}
          >
            {record.isActive ? 'Деактивировать' : 'Активировать'}
          </Button>
        </Space>
      ),
    },
  ];

  // Безопасная фильтрация пользователей
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => !roleFilter || user.role === roleFilter)
    : [];

  return (
    <div>
      <div className="mb-4">
        <Select
          placeholder="Фильтр по роли"
          value={roleFilter}
          onChange={setRoleFilter}
          allowClear
          style={{ width: 200 }}
        >
          <Option value="CLIENT">Клиенты</Option>
          <Option value="MASTER">Мастера</Option>
          <Option value="ADMIN">Администраторы</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        locale={{ emptyText: 'Нет пользователей' }}
      />
    </div>
  );
};

export default AdminUsersPage; 