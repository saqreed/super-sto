import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchChats, sendMessage, markMessagesAsRead, setActiveChat } from '../../store/slices/chatSlice';
import { Message, Chat } from '../../types';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  PhotoIcon,
  DocumentIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  requestId?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, requestId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { chats, messages, activeChat, loading } = useSelector((state: RootState) => state.chat);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      dispatch(fetchChats(user.id));
    }
  }, [isOpen, user, dispatch]);

  useEffect(() => {
    if (requestId && chats.length > 0) {
      const chat = chats.find(c => c.requestId === requestId);
      if (chat) {
        dispatch(setActiveChat(chat.id));
      }
    }
  }, [requestId, chats, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !user) return;

    const chat = chats.find(c => c.id === activeChat);
    if (!chat) return;

    // Handle file attachments
    const attachments = selectedFiles.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file), // В реальном приложении файл загружается на сервер
      type: file.type.startsWith('image/') ? 'image' as const : 'document' as const,
      size: file.size,
    }));

    await dispatch(sendMessage({
      chatId: activeChat,
      requestId: chat.requestId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: newMessage,
      attachments: attachments.length > 0 ? attachments : undefined,
    }));

    setNewMessage('');
    setSelectedFiles([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(date));
  };

  const activeChatData = chats.find(c => c.id === activeChat);
  const chatMessages = activeChat ? messages[activeChat] || [] : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[600px] flex">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Чаты</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Загрузка...</div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Нет активных чатов</p>
              </div>
            ) : (
              chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => dispatch(setActiveChat(chat.id))}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    activeChat === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Заявка #{chat.requestId}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {chat.lastMessage.content}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(chat.updatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {activeChatData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Заявка #{activeChatData.requestId}
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Участники: {activeChatData.participants.map(p => p.userName).join(', ')}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {message.senderId !== user?.id && (
                        <div className="text-xs font-medium mb-1 opacity-75">
                          {message.senderName}
                        </div>
                      )}
                      <div className="text-sm">{message.content}</div>
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map(attachment => (
                            <div
                              key={attachment.id}
                              className="flex items-center space-x-2 p-2 bg-black bg-opacity-10 rounded"
                            >
                              {attachment.type === 'image' ? (
                                <PhotoIcon className="h-4 w-4" />
                              ) : (
                                <DocumentIcon className="h-4 w-4" />
                              )}
                              <span className="text-xs truncate">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs mt-1 opacity-75">
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2"
                      >
                        {file.type.startsWith('image/') ? (
                          <PhotoIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <DocumentIcon className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                          {file.name}
                        </span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Введите сообщение..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                    />
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Выберите чат для начала общения</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 