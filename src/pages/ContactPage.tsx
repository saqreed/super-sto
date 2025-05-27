import React, { useState } from 'react';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Отправка формы:', formData);
    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const locations = [
    {
      name: 'СуперСТО Центр',
      address: 'ул. Автомобильная, 15',
      phone: '+7 (495) 123-45-67',
      email: 'center@supersto.ru',
      hours: 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00'
    },
    {
      name: 'СуперСТО Север',
      address: 'ул. Северная, 42',
      phone: '+7 (495) 123-45-68',
      email: 'north@supersto.ru',
      hours: 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00'
    },
    {
      name: 'СуперСТО Юг',
      address: 'ул. Южная, 28',
      phone: '+7 (495) 123-45-69',
      email: 'south@supersto.ru',
      hours: 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Контакты
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Свяжитесь с нами любым удобным способом. Мы всегда готовы ответить на ваши вопросы 
          и помочь с обслуживанием вашего автомобиля.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Напишите нам
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Тема обращения
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Выберите тему</option>
                  <option value="service">Вопрос по обслуживанию</option>
                  <option value="parts">Вопрос по запчастям</option>
                  <option value="booking">Запись на обслуживание</option>
                  <option value="complaint">Жалоба</option>
                  <option value="suggestion">Предложение</option>
                  <option value="other">Другое</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Сообщение *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="input-field"
                placeholder="Опишите ваш вопрос или проблему..."
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
              Отправить сообщение
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Общие контакты
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    +7 (495) 123-45-66
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Горячая линия (круглосуточно)
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    info@supersto.ru
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Общие вопросы
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Пн-Пт: 8:00-20:00
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Сб-Вс: 9:00-18:00
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Экстренная помощь
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    +7 (495) 911-11-11
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Эвакуатор (24/7)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Locations */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Наши филиалы
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <div key={index} className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {location.name}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5" />
                  <div className="text-gray-600 dark:text-gray-300">
                    {location.address}
                  </div>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                  <div className="text-gray-600 dark:text-gray-300">
                    {location.phone}
                  </div>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                  <div className="text-gray-600 dark:text-gray-300">
                    {location.email}
                  </div>
                </div>
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5" />
                  <div className="text-gray-600 dark:text-gray-300">
                    {location.hours}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 