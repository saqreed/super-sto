import React, { useState } from 'react';

export default function TestConnection() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setStatus('loading');
    setMessage('Проверяем соединение...');
    
    try {
      // Попробуем получить публичную информацию или health check
      const response = await fetch('http://localhost:8081/api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok || response.status === 401) {
        // 401 означает что backend работает, но нужна аутентификация
        setStatus('success');
        setMessage('✅ Backend работает на http://localhost:8081/api');
      } else {
        setStatus('error');
        setMessage(`❌ Ошибка: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Не удалось подключиться к backend: ${error.message}`);
    }
  };

  const testAuth = async () => {
    setStatus('loading');
    setMessage('Тестируем API аутентификации...');
    
    try {
      // Тестируем публичный endpoint регистрации (без токена)
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        })
      });
      
      if (response.status === 400 || response.status === 409) {
        // 400/409 означает что API работает (валидация/конфликт)
        setStatus('success');
        setMessage('✅ API аутентификации работает');
      } else if (response.ok) {
        setStatus('success');
        setMessage('✅ API аутентификации работает (тестовый пользователь создан)');
      } else {
        const text = await response.text();
        setStatus('error');
        setMessage(`❌ Ошибка API: ${response.status} - ${text}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Ошибка соединения с API: ${error.message}`);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🔧 Тестирование Backend
      </h3>
      
      <div className="space-y-4">
        <div className="flex space-x-3">
          <button
            onClick={testConnection}
            disabled={status === 'loading'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Проверка...' : 'Проверить соединение'}
          </button>
          
          <button
            onClick={testAuth}
            disabled={status === 'loading'}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Тестирование...' : 'Тест API'}
          </button>
        </div>

        {message && (
          <div className={`p-4 border rounded-md ${getStatusColor()}`}>
            <div className="flex items-center">
              {status === 'loading' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>Backend URL:</strong> http://localhost:8081/api</p>
          <p><strong>Статус:</strong> {status === 'idle' ? 'Не проверен' : status}</p>
        </div>
      </div>
    </div>
  );
} 