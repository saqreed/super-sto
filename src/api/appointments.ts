import client from './client';
import type { 
  Appointment, 
  CreateAppointmentRequest, 
  AppointmentFilters,
  AssignMasterRequest,
  CreateWorkReportRequest,
  AppointmentDetails
} from '../types';

export const appointmentsAPI = {
  // Мои записи
  getUserAppointments: () => client.get('/appointments/my'),
  
  // Все записи (для мастеров и админов)
  getAll: (filters?: AppointmentFilters) => client.get('/appointments', { params: filters }),
  
  // Получить запись по ID
  getById: (id: string) => client.get(`/appointments/${id}`),
  
  // Получить детальную информацию о записи (для мастера)
  getDetails: (id: string) => client.get(`/appointments/${id}/details`),
  
  // Создать запись
  create: (appointmentData: CreateAppointmentRequest) => client.post('/appointments', appointmentData),
  
  // Обновить запись
  update: (id: string, appointmentData: Partial<Appointment>) => client.put(`/appointments/${id}`, appointmentData),
  
  // Отменить запись
  cancel: (id: string) => client.put(`/appointments/${id}/status`, null, { params: { status: 'CANCELLED' } }),
  
  // Завершить запись
  complete: (id: string) => client.put(`/appointments/${id}/status`, null, { params: { status: 'COMPLETED' } }),
  
  // Начать работу (для мастера)
  start: (id: string) => client.put(`/appointments/${id}/status`, null, { params: { status: 'IN_PROGRESS' } }),
  
  // Подтвердить запись
  confirm: (id: string) => client.put(`/appointments/${id}/status`, null, { params: { status: 'CONFIRMED' } }),
  
  // Удалить запись
  delete: (id: string) => client.delete(`/appointments/${id}`),
  
  // НОВЫЕ МЕТОДЫ ДЛЯ УПРАВЛЕНИЯ И ОТЧЕТОВ
  
  // Назначить мастера на запись (только для админа)
  assignMaster: (data: AssignMasterRequest) => 
    client.put(`/appointments/${data.appointmentId}/assign-master`, data),
  
  // Создать/обновить отчет о работе (для мастера)
  createWorkReport: (data: CreateWorkReportRequest) => 
    client.post(`/appointments/${data.appointmentId}/work-report`, data),
  
  // Получить отчет о работе
  getWorkReport: (appointmentId: string) => 
    client.get(`/appointments/${appointmentId}/work-report`),
  
  // Обновить отчет о работе
  updateWorkReport: (appointmentId: string, data: CreateWorkReportRequest) => 
    client.put(`/appointments/${appointmentId}/work-report`, data),
}; 
