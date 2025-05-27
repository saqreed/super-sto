import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchServices, fetchServiceStations } from '../store/slices/servicesSlice';
import { 
  WrenchScrewdriverIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { services, serviceStations, loading } = useAppSelector(state => state.services);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchServiceStations());
  }, [dispatch]);

  const features = [
    {
      icon: WrenchScrewdriverIcon,
      title: 'Профессиональный сервис',
      description: 'Опытные мастера с многолетним стажем работы'
    },
    {
      icon: ClockIcon,
      title: 'Быстрое обслуживание',
      description: 'Минимальное время ожидания, точное соблюдение сроков'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Гарантия качества',
      description: 'Гарантия на все виды работ и запчасти'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              СуперСТО
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Современный сервис для комплексного обслуживания автомобилей
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Записаться на обслуживание
              </Link>
              <Link
                to="/parts"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Каталог запчастей
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Мы предоставляем качественные услуги по обслуживанию автомобилей
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Наши услуги
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Полный спектр услуг по обслуживанию и ремонту автомобилей
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="card p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {service.price.toLocaleString()} ₽
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {service.duration} мин
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/booking"
              className="btn-primary"
            >
              Записаться на обслуживание
            </Link>
          </div>
        </div>
      </section>

      {/* Service Stations Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Наши СТО
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Удобное расположение по всему городу
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceStations.map((station) => (
              <div key={station.id} className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {station.name}
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{station.address}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <span>{station.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>
                      {station.workingHours.start} - {station.workingHours.end}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы обслужить ваш автомобиль?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Запишитесь на обслуживание прямо сейчас или закажите необходимые запчасти
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Записаться на обслуживание
            </Link>
            <Link
              to="/parts"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Заказать запчасти
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 