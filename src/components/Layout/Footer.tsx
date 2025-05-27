import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">С</span>
              </div>
              <span className="ml-2 text-xl font-bold">СуперСТО</span>
            </div>
            <p className="text-gray-300 mb-4">
              Современный сервис для комплексного обслуживания автомобилей. 
              Качественный ремонт, оригинальные запчасти, профессиональные мастера.
            </p>
            <div className="text-gray-300">
              <p>📞 +7 (495) 123-45-67</p>
              <p>📧 info@supersto.ru</p>
              <p>📍 г. Москва, ул. Ленина, 123</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/booking" className="hover:text-primary-400">Техническое обслуживание</Link></li>
              <li><Link to="/booking" className="hover:text-primary-400">Диагностика</Link></li>
              <li><Link to="/booking" className="hover:text-primary-400">Ремонт двигателя</Link></li>
              <li><Link to="/booking" className="hover:text-primary-400">Тормозная система</Link></li>
              <li><Link to="/parts" className="hover:text-primary-400">Запчасти</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-primary-400">Главная</Link></li>
              <li><Link to="/booking" className="hover:text-primary-400">Записаться</Link></li>
              <li><Link to="/parts" className="hover:text-primary-400">Каталог деталей</Link></li>
              <li><Link to="/profile" className="hover:text-primary-400">Личный кабинет</Link></li>
              <li><Link to="/about" className="hover:text-primary-400">О нас</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400">Контакты</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 СуперСТО. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 