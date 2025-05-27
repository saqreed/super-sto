import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import { LoginForm } from '../types';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Неверный формат email')
      .required('Email обязателен'),
    password: Yup.string()
      .min(6, 'Пароль должен содержать минимум 6 символов')
      .required('Пароль обязателен'),
  });

  const initialValues: LoginForm = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: LoginForm) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate('/');
    } catch (error) {
      // Ошибка обрабатывается в Redux
    }
  };

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">С</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Вход в аккаунт
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Или{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              создайте новый аккаунт
            </Link>
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email адрес
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="input-field mt-1"
                    placeholder="Введите ваш email"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Пароль
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="input-field mt-1"
                    placeholder="Введите ваш пароль"
                  />
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Запомнить меня
                  </label>
                </div>

                <div className="text-sm">
                                  <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Забыли пароль?
                </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Войти'
                  )}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                      Или войдите через
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Telegram
                  </button>
                </div>
              </div>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Демо аккаунты:
                </h4>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <div>Клиент: client@demo.com / password</div>
                  <div>Мастер: master@demo.com / password</div>
                  <div>Админ: admin@demo.com / password</div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage; 