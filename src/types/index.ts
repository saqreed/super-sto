// Константы и энумы
export const USER_ROLES = {
  CLIENT: 'CLIENT',
  MASTER: 'MASTER',
  ADMIN: 'ADMIN',
} as const;

export const LOYALTY_LEVELS = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
} as const;

export const SERVICE_CATEGORIES = {
  MAINTENANCE: 'MAINTENANCE',
  REPAIR: 'REPAIR',
  BODY_WORK: 'BODY_WORK',
  DIAGNOSTIC: 'DIAGNOSTIC',
  DETAILING: 'DETAILING',
} as const;

export const APPOINTMENT_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export const MESSAGE_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  FILE: 'FILE',
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const;

// Типы на основе констант
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type LoyaltyLevel = typeof LOYALTY_LEVELS[keyof typeof LOYALTY_LEVELS];
export type ServiceCategory = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES];
export type AppointmentStatus = typeof APPOINTMENT_STATUSES[keyof typeof APPOINTMENT_STATUSES];
export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];
export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Базовые интерфейсы
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  loyaltyLevel?: LoyaltyLevel;
  loyaltyPoints?: number;
  isActive: boolean;
}

// Аутентификация
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

// Услуги
export interface Service extends BaseEntity {
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number; // в минутах
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

// Записи
export interface Appointment extends BaseEntity {
  serviceId: string;
  serviceName: string;
  masterId: string;
  masterName: string;
  clientId: string;
  clientName: string;
  appointmentDateTime: string;
  notes?: string;
  status: AppointmentStatus;
  assignedBy?: string; // ID администратора, который назначил мастера
  actualStartTime?: string;
  actualEndTime?: string;
  workReport?: WorkReport; // Отчет мастера о выполненной работе
}

export interface CreateAppointmentRequest {
  serviceId: string;
  masterId: string;
  appointmentDateTime: string;
  notes?: string;
}

// Новый интерфейс для назначения мастера администратором
export interface AssignMasterRequest {
  appointmentId: string;
  masterId: string;
  notes?: string;
}

// Отчет мастера о выполненной работе
export interface WorkReport {
  description: string; // Подробное описание выполненной работы
  usedParts: UsedPart[]; // Использованные детали
  laborTime: number; // Фактическое время работы в минутах
  additionalCosts: number; // Дополнительные расходы
  recommendations?: string; // Рекомендации клиенту
  photos?: string[]; // Фото выполненной работы
  createdAt: string;
  updatedAt?: string;
}

// Использованная деталь
export interface UsedPart {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

// Запрос на создание/обновление отчета о работе
export interface CreateWorkReportRequest {
  appointmentId: string;
  description: string;
  usedParts: {
    productId: string;
    quantity: number;
  }[];
  laborTime: number;
  additionalCosts: number;
  recommendations?: string;
  photos?: string[];
}

// Расширенная информация о записи для мастера
export interface AppointmentDetails extends Appointment {
  serviceDetails: Service;
  clientDetails: User;
  canEditReport: boolean;
}

// Продукты
export interface Product extends BaseEntity {
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Заказы
export interface Order extends BaseEntity {
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  deliveryAddress: string;
}

// Отзывы
export interface Review extends BaseEntity {
  serviceId?: string;
  serviceName?: string;
  masterId?: string;
  masterName?: string;
  appointmentId?: string;
  rating: number;
  comment: string;
  clientName: string;
}

export interface CreateReviewRequest {
  serviceId?: string;
  masterId?: string;
  appointmentId?: string;
  rating: number;
  comment: string;
}

// Чат
export interface ChatMessage extends BaseEntity {
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  type: MessageType;
  appointmentId?: string;
  isRead: boolean;
}

export interface SendMessageRequest {
  recipientId: string;
  content: string;
  type: MessageType;
  appointmentId?: string;
}

// Уведомления
export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
}

// Аналитика (для админки)
export interface DashboardStats {
  totalClients: number;
  totalMasters: number;
  todayAppointments: number;
  monthRevenue: number;
  monthGrowth: number;
  pendingOrders: number;
  lowStockItems: number;
  averageRating: number;
  topServices: ServiceStat[];
  topMasters: MasterStat[];
}

export interface ServiceStat {
  serviceId: string;
  serviceName: string;
  count: number;
  revenue: number;
}

export interface MasterStat {
  masterId: string;
  masterName: string;
  appointmentCount: number;
  averageRating: number;
  revenue: number;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// Пагинация
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

// Фильтры
export interface BaseFilters {
  search?: string;
}

export interface ServiceFilters extends BaseFilters {
  category?: ServiceCategory;
  minPrice?: number;
  maxPrice?: number;
}

export interface AppointmentFilters extends BaseFilters {
  status?: AppointmentStatus;
  masterId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ProductFilters extends BaseFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
} 