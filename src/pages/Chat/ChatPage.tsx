import React, { useEffect, useState } from 'react';
import { Row, Col, Card, List, Avatar, Input, Button, Typography } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchConversations, fetchMessages, sendMessage } from '../../store/slices/chatSlice';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const { Text } = Typography;

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();
  const { conversations, messages } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    dispatch(fetchConversations() as any);
  }, [dispatch]);

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    dispatch(fetchMessages(conversation.userId) as any);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    dispatch(sendMessage({
      recipientId: selectedConversation.userId,
      content: messageText,
      type: 'TEXT',
    }) as any);

    setMessageText('');
  };

  // Безопасное извлечение данных
  const safeConversations = Array.isArray(conversations) ? conversations : [];
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <Row gutter={16} className="h-[calc(100vh-200px)]">
      {/* Список переписок */}
      <Col xs={24} md={8}>
        <Card title="Переписки" className="h-full">
          <List
            dataSource={safeConversations}
            renderItem={(conversation) => (
              <List.Item
                className={`cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.userId === conversation.userId ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={conversation.userName || 'Неизвестный пользователь'}
                  description={conversation.lastMessage || 'Нет сообщений'}
                />
              </List.Item>
            )}
            locale={{ emptyText: 'Нет переписок' }}
          />
        </Card>
      </Col>

      {/* Окно чата */}
      <Col xs={24} md={16}>
        <Card
          title={selectedConversation ? `Чат с ${selectedConversation.userName || 'Неизвестный пользователь'}` : 'Выберите переписку'}
          className="h-full flex flex-col"
          styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
        >
          {selectedConversation ? (
            <>
              {/* Сообщения */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {safeMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div>{message.content || 'Пустое сообщение'}</div>
                      <div className={`text-xs mt-1 ${
                        message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.createdAt 
                          ? format(new Date(message.createdAt), 'HH:mm', { locale: ru })
                          : 'Время не указано'
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Поле ввода */}
              <div className="flex space-x-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Введите сообщение..."
                  onPressEnter={handleSendMessage}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  Отправить
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Text type="secondary">Выберите переписку для начала общения</Text>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ChatPage; 