import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchServices, fetchServiceStations } from '../store/slices/servicesSlice';
import { createRequest } from '../store/slices/requestsSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { BookingForm, RequestStatus } from '../types';
import { 
  MapPinIcon, 
  ClockIcon, 
  PhoneIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const BookingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { services, serviceStations, loading } = useAppSelector(state => state.services);
  const { user } = useAppSelector(state => state.auth);
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchServiceStations());
  }, [dispatch]);

  const validationSchema = Yup.object({
    serviceStationId: Yup.string().required('Выберите СТО'),
    serviceId: Yup.string().required('Выберите услугу'),
    date: Yup.string().required('Выберите дату'),
    time: Yup.string().required('Выберите время'),
    description: Yup.string().max(500, 'Описание не должно превышать 500 символов'),
  });

  const initialValues: BookingForm = {
    serviceStationId: '',
    serviceId: '',
    date: '',
    time: '',
    description: '',
  };

  const handleSubmit = async (values: BookingForm) => {
    if (!user) {
      dispatch(addNotification({
        userId: '',
        title: 'Требуется авторизация',
        message: 'Войдите в аккаунт для записи на обслуживание',
        type: 'warning',
        read: false
      }));
      return;
    }

    try {
      const scheduledDate = new Date(`${values.date}T${values.time}`);
      
      await dispatch(createRequest({
        clientId: user.id,
        serviceStationId: values.serviceStationId,
        serviceId: values.serviceId,
        status: RequestStatus.PENDING,
        scheduledDate,
        description: values.description,
      })).unwrap();

      dispatch(addNotification({
        userId: user.id,
        title: 'Запись создана',
        message: 'Ваша заявка на обслуживание успешно создана',
        type: 'success',
        read: false
      }));

      navigate('/profile');
    } catch (error) {
      dispatch(addNotification({
        userId: user.id,
        title: 'Ошибка',
        message: 'Не удалось создать заявку. Попробуйте еще раз',
        type: 'error',
        read: false
      }));
    }
  };

  const selectedStationData = serviceStations.find(station => station.id === selectedStation);
  const selectedServiceData = services.find(service => service.id === selectedService);

  // Генерация доступных временных слотов
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Запись на обслуживание
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form className="space-y-6">
                    {/* Service Station Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Выберите СТО
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceStations.map((station) => (
                          <div
                            key={station.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                              values.serviceStationId === station.id
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => {
                              setFieldValue('serviceStationId', station.id);
                              setSelectedStation(station.id);
                            }}
                          >
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {station.name}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-2" />
                                {station.address}
                              </div>
                              <div className="flex items-center">
                                <PhoneIcon className="h-4 w-4 mr-2" />
                                {station.phone}
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                {station.workingHours.start} - {station.workingHours.end}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <ErrorMessage name="serviceStationId" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                    </div>

                    {/* Service Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Выберите услугу
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                              values.serviceId === service.id
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => {
                              setFieldValue('serviceId', service.id);
                              setSelectedService(service.id);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {service.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                  {service.description}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {service.duration} мин
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                                  {service.price.toLocaleString()} ₽
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <ErrorMessage name="serviceId" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                    </div>

                    {/* Date and Time Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Дата
                        </label>
                        <Field
                          id="date"
                          name="date"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="input-field"
                        />
                        <ErrorMessage name="date" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                      </div>

                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Время
                        </label>
                        <Field
                          as="select"
                          id="time"
                          name="time"
                          className="input-field"
                        >
                          <option value="">Выберите время</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="time" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Описание проблемы (необязательно)
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Опишите проблему с автомобилем..."
                        className="input-field"
                      />
                      <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting || !user}
                        className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CalendarDaysIcon className="h-5 w-5 mr-2" />
                        )}
                        {!user ? 'Войдите для записи' : 'Записаться на обслуживание'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Детали записи
              </h3>

              {selectedStationData && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">СТО</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <div>{selectedStationData.name}</div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {selectedStationData.address}
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {selectedStationData.phone}
                    </div>
                  </div>
                </div>
              )}

              {selectedServiceData && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Услуга</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <div className="font-medium">{selectedServiceData.name}</div>
                    <div>{selectedServiceData.description}</div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {selectedServiceData.duration} мин
                      </span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {selectedServiceData.price.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                  Запись будет подтверждена в течение 30 минут
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage; 