import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { registerUser, clearError } from '../store/slices/authSlice';
import { RegisterForm, UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.auth);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Имя должно содержать минимум 2 символа')
      .required('Имя обязательно'),
    email: Yup.string()
      .email('Неверный формат email')
      .required('Email обязателен'),
    phone: Yup.string()
      .matches(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, 'Неверный формат телефона')
      .required('Телефон обязателен'),
    password: Yup.string()
      .min(6, 'Пароль должен содержать минимум 6 символов')
      .required('Пароль обязателен'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
      .required('Подтверждение пароля обязательно'),
    role: Yup.string()
      .oneOf(Object.values(UserRole), 'Выберите роль')
      .required('Роль обязательна'),
  });

  const initialValues: RegisterForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: UserRole.CLIENT,
  };

  const handleSubmit = async (values: RegisterForm) => {
    try {
      await dispatch(registerUser(values)).unwrap();
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
            Создание аккаунта
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Или{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              войдите в существующий аккаунт
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Полное имя
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="input-field mt-1"
                    placeholder="Введите ваше имя"
                  />
                  <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email адрес
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="input-field mt-1"
                    placeholder="Введите ваш email"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Телефон
                  </label>
                  <Field
                    id="phone"
                    name="phone"
                    type="tel"
                    className="input-field mt-1"
                    placeholder="+7 (999) 123-45-67"
                  />
                  <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Роль
                  </label>
                  <Field
                    as="select"
                    id="role"
                    name="role"
                    className="input-field mt-1"
                  >
                    <option value={UserRole.CLIENT}>Клиент</option>
                    <option value={UserRole.MASTER}>Мастер</option>
                    <option value={UserRole.ADMIN}>Администратор</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Пароль
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="input-field mt-1"
                    placeholder="Введите пароль"
                  />
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Подтверждение пароля
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="input-field mt-1"
                    placeholder="Повторите пароль"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
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
                    'Создать аккаунт'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage; 