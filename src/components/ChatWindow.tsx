import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  sendMessage,
  fetchConversation,
  fetchMyChats,
  fetchUnreadCount,
  markMessageAsRead,
  setActiveUser,
  clearCurrentConversation,
} from '../store/slices/chatSlice';
import {
  Card,
  Input,
  Button,
  List,
  Avatar,
  Badge,
  Empty,
  Spin,
  Alert,
  Row,
  Col,
  Typography,
  Space,
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const { TextArea } = Input;
const { Text, Title } = Typography;

const ChatWindow: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    conversations,
    currentConversation,
    activeUserId,
    unreadCount,
    loading,
    error,
  } = useSelector((state: RootState) => state.chat);

  const [messageText, setMessageText] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchMyChats());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUserId) {
      dispatch(setActiveUser(selectedUserId));
      dispatch(fetchConversation(selectedUserId));
    }
  }, [selectedUserId, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUserId) return;

    try {
      await dispatch(
        sendMessage({
          receiverId: selectedUserId,
          content: messageText.trim(),
          messageType: 'TEXT',
        })
      ).unwrap();
      setMessageText('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  };

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId);
    // Отмечаем сообщения как прочитанные
    const unreadMessages = currentConversation.filter(
      msg => msg.senderId === userId && !msg.isRead
    );
    unreadMessages.forEach(msg => {
      dispatch(markMessageAsRead(msg.id));
    });
  };

  if (error) {
    return (
      <Alert
        message="Ошибка чата"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div style={{ height: '600px', display: 'flex' }}>
      {/* Список чатов */}
      <Card
        title={
          <Space>
            <MessageOutlined />
            Чаты
            {unreadCount > 0 && (
              <Badge count={unreadCount} size="small" />
            )}
          </Space>
        }
        style={{ width: '300px', marginRight: '16px' }}
        bodyStyle={{ padding: 0, height: '520px', overflow: 'auto' }}
      >
        {loading && conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : conversations.length === 0 ? (
          <Empty
            description="Нет активных чатов"
            style={{ marginTop: '50px' }}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={(conversation) => (
              <List.Item
                onClick={() => handleSelectConversation(conversation.otherUserId)}
                style={{
                  cursor: 'pointer',
                  backgroundColor:
                    selectedUserId === conversation.otherUserId
                      ? '#f0f0f0'
                      : 'white',
                  padding: '12px 16px',
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge count={conversation.unreadCount} size="small">
                      <Avatar icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={conversation.otherUserName}
                  description={
                    <div>
                      <Text ellipsis style={{ width: '200px' }}>
                        {conversation.lastMessage.content}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatDistanceToNow(
                          new Date(conversation.lastMessage.sentAt),
                          { addSuffix: true, locale: ru }
                        )}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Окно чата */}
      <Card
        title={
          selectedUserId ? (
            conversations.find(c => c.otherUserId === selectedUserId)?.otherUserName || 'Чат'
          ) : (
            'Выберите чат'
          )
        }
        style={{ flex: 1 }}
        bodyStyle={{ padding: 0, height: '520px', display: 'flex', flexDirection: 'column' }}
      >
        {!selectedUserId ? (
          <Empty
            description="Выберите чат для начала общения"
            style={{ margin: 'auto' }}
          />
        ) : (
          <>
            {/* Сообщения */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              {currentConversation.length === 0 ? (
                <Empty description="Нет сообщений" />
              ) : (
                currentConversation.map((message) => {
                  const isMyMessage = message.senderId !== selectedUserId;
                  return (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '8px 12px',
                          borderRadius: '12px',
                          backgroundColor: isMyMessage ? '#1890ff' : '#f5f5f5',
                          color: isMyMessage ? 'white' : 'black',
                        }}
                      >
                        <div>{message.content}</div>
                        <div
                          style={{
                            fontSize: '11px',
                            opacity: 0.7,
                            marginTop: '4px',
                            textAlign: 'right',
                          }}
                        >
                          {formatDistanceToNow(new Date(message.sentAt), {
                            addSuffix: true,
                            locale: ru,
                          })}
                          {isMyMessage && (
                            <span style={{ marginLeft: '4px' }}>
                              {message.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
              <Row gutter={8}>
                <Col flex="auto">
                  <TextArea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Введите сообщение..."
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || loading}
                    loading={loading}
                  >
                    Отправить
                  </Button>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ChatWindow; 