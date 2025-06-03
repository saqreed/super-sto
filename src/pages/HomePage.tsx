import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import TestConnection from '../components/TestConnection';
import {
  WrenchScrewdriverIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const features = [
    {
      name: 'Профессиональный сервис',
      description: 'Опытные мастера с многолетним стажем',
      icon: WrenchScrewdriverIcon,
    },
    {
      name: 'Качественные запчасти',
      description: 'Только оригинальные и сертифицированные детали',
      icon: SparklesIcon,
    },
    {
      name: 'Быстрое обслуживание',
      description: 'Минимальное время ожидания',
      icon: ClockIcon,
    },
    {
      name: 'Гарантия качества',
      description: 'Гарантия на все виды работ',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Программа лояльности',
      description: 'Скидки для постоянных клиентов',
      icon: TrophyIcon,
    },
    {
      name: 'Команда профессионалов',
      description: 'Квалифицированные специалисты',
      icon: UserGroupIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white dark:bg-gray-800 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Добро пожаловать в</span>{' '}
                  <span className="block text-blue-600 xl:inline">СуперСТО</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Профессиональное обслуживание автомобилей. Записывайтесь онлайн и получайте качественный сервис от наших мастеров.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/booking"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Записаться на обслуживание
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/parts"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Каталог запчастей
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-blue-400 to-blue-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <WrenchScrewdriverIcon className="h-32 w-32 mx-auto mb-4" />
              <p className="text-xl font-semibold">Ваш автомобиль в надежных руках</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Почему выбирают нас
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Преимущества СуперСТО
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </p>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Greeting */}
      {isAuthenticated && user && (
        <div className="bg-blue-50 dark:bg-blue-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Добро пожаловать, {user.firstName || user.name || 'Пользователь'}!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Вы можете записаться на обслуживание или просмотреть каталог запчастей
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <Link
                  to="/profile"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Мой профиль
                </Link>
                <Link
                  to="/booking"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Записаться
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Connection */}
      <div className="py-8 bg-gray-100 dark:bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestConnection />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Готовы обслужить ваш автомобиль?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Записывайтесь на удобное время и получайте профессиональный сервис
          </p>
          <Link
            to="/booking"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Записаться сейчас
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 