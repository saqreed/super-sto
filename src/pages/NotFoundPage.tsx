import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Страница не найдена
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full flex items-center justify-center"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            На главную
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Назад
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Возможно, вас заинтересует:
          </p>
          <div className="space-y-2">
            <Link
              to="/booking"
              className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
            >
              Записаться на обслуживание
            </Link>
            <Link
              to="/parts"
              className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
            >
              Каталог запчастей
            </Link>
            <Link
              to="/contact"
              className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 