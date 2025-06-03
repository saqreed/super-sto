// Роли пользователей
export enum UserRole {
  CLIENT = 'client',
  MASTER = 'master',
  ADMIN = 'admin'
}

// Пользователь
export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  loyaltyLevel?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  loyaltyPoints?: number;
  createdAt: Date;
}

// Статусы заявок
export enum RequestStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// СТО
export interface ServiceStation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  workingHours: {
    start: string;
    end: string;
  };
  services: string[];
}

// Услуга
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // в минутах
  category: string;
}

// Заявка на обслуживание
export interface ServiceRequest {
  id: string;
  clientId: string;
  serviceStationId: string;
  serviceId: string;
  masterId?: string;
  status: RequestStatus;
  scheduledDate: Date;
  description?: string;
  photos?: string[];
  report?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Деталь
export interface Part {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  model: string;
  article: string;
  category: string;
  images: string[];
  inStock: boolean;
  quantity: number;
}

// Элемент корзины
export interface CartItem {
  part: Part;
  quantity: number;
}

// Заказ деталей
export interface PartsOrder {
  id: string;
  clientId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Уведомление
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

// Форма авторизации
export interface LoginForm {
  email: string;
  password: string;
}

// Форма регистрации
export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  role: UserRole;
}

// Форма записи на обслуживание
export interface BookingForm {
  serviceStationId: string;
  serviceId: string;
  date: string;
  time: string;
  description?: string;
}

// Chat System Types
export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  attachments?: MessageAttachment[];
  createdAt: Date;
  read: boolean;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video';
  size: number;
}

export interface Chat {
  id: string;
  requestId: string;
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatParticipant {
  userId: string;
  userName: string;
  userRole: UserRole;
  joinedAt: Date;
  lastReadAt?: Date;
}

// Rating and Review System
export interface Review {
  id: string;
  requestId: string;
  clientId: string;
  masterId: string;
  serviceStationId: string;
  rating: number; // 1-5
  comment: string;
  photos?: string[];
  createdAt: Date;
  response?: ReviewResponse;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  responderId: string;
  responderRole: UserRole;
  content: string;
  createdAt: Date;
}

// Calendar and Scheduling
export interface TimeSlot {
  id: string;
  serviceStationId: string;
  masterId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBlocked: boolean;
  blockReason?: string;
}

export interface Appointment {
  id: string;
  requestId: string;
  timeSlotId: string;
  clientId: string;
  masterId?: string;
  serviceStationId: string;
  status: AppointmentStatus;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

// Loyalty System
export interface LoyaltyAccount {
  id: string;
  userId: string;
  points: number;
  totalEarned: number;
  totalSpent: number;
  tier: LoyaltyTier;
  createdAt: Date;
  updatedAt: Date;
}

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

export interface LoyaltyTransaction {
  id: string;
  accountId: string;
  type: 'earn' | 'spend';
  points: number;
  description: string;
  relatedOrderId?: string;
  createdAt: Date;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'bonus_points' | 'free_service';
  value: number;
  minOrderAmount?: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  applicableServices?: string[];
  applicableTiers?: LoyaltyTier[];
}

// Analytics Types
export interface AnalyticsData {
  revenue: RevenueData;
  services: ServiceAnalytics;
  masters: MasterAnalytics[];
  customers: CustomerAnalytics;
  inventory: InventoryAnalytics;
}

export interface RevenueData {
  daily: number[];
  weekly: number[];
  monthly: number[];
  yearly: number[];
  total: number;
  growth: number;
}

export interface ServiceAnalytics {
  mostPopular: ServicePopularity[];
  revenue: ServiceRevenue[];
  completion: ServiceCompletion[];
}

export interface ServicePopularity {
  serviceId: string;
  serviceName: string;
  count: number;
  percentage: number;
}

export interface ServiceRevenue {
  serviceId: string;
  serviceName: string;
  revenue: number;
  count: number;
  averagePrice: number;
}

export interface ServiceCompletion {
  serviceId: string;
  serviceName: string;
  completed: number;
  cancelled: number;
  completionRate: number;
}

export interface MasterAnalytics {
  id: string;
  name: string;
  completedJobs: number;
  averageRating: number;
  revenue: number;
  efficiency: number;
  customerSatisfaction: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  churnRate: number;
}

export interface InventoryAnalytics {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  topSellingParts: PartSales[];
  inventoryValue: number;
  turnoverRate: number;
}

export interface PartSales {
  partId: string;
  partName: string;
  quantitySold: number;
  revenue: number;
}

// File Management
export interface FileUpload {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  relatedTo?: {
    type: 'request' | 'user' | 'review' | 'message';
    id: string;
  };
}

// Inventory Management
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  isActive: boolean;
  paymentTerms: string;
  deliveryTime: number; // days
  createdAt: Date;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  orderNumber: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  orderDate: Date;
  expectedDelivery: Date;
  actualDelivery?: Date;
  notes?: string;
  createdBy: string;
}

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface PurchaseOrderItem {
  partId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StockMovement {
  id: string;
  partId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  relatedOrderId?: string;
  performedBy: string;
  createdAt: Date;
}

// Enhanced Part with inventory tracking
export interface EnhancedPart extends Part {
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  supplierId?: string;
  lastRestocked?: Date;
  averageCost: number;
  location?: string;
  barcode?: string;
}

// Financial Management
export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  relatedTo?: {
    type: 'request' | 'purchase' | 'salary' | 'other';
    id: string;
  };
  paymentMethod: string;
  date: Date;
  createdBy: string;
}

export interface Salary {
  id: string;
  masterId: string;
  period: {
    from: Date;
    to: Date;
  };
  baseSalary: number;
  commission: number;
  bonuses: number;
  deductions: number;
  totalAmount: number;
  status: 'pending' | 'paid';
  paidAt?: Date;
  createdAt: Date;
}

// CRM Types
export interface CustomerProfile {
  id: string;
  userId: string;
  segment: CustomerSegment;
  preferences: CustomerPreferences;
  history: CustomerHistory;
  notes: CustomerNote[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum CustomerSegment {
  NEW = 'new',
  REGULAR = 'regular',
  VIP = 'vip',
  INACTIVE = 'inactive'
}

export interface CustomerPreferences {
  preferredServices: string[];
  preferredMasters: string[];
  preferredTimeSlots: string[];
  communicationChannel: 'email' | 'sms' | 'phone' | 'app';
  reminderSettings: {
    enabled: boolean;
    timing: number; // hours before appointment
  };
}

export interface CustomerHistory {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  favoriteService?: string;
  loyaltyPoints: number;
}

export interface CustomerNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  isImportant: boolean;
}

// Marketing Campaign
export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  targetSegments: CustomerSegment[];
  content: {
    subject?: string;
    message: string;
    imageUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  scheduledAt?: Date;
  sentAt?: Date;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdBy: string;
  createdAt: Date;
}

// Diagnostic System
export interface DiagnosticQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text' | 'scale';
  options?: string[];
  category: string;
  order: number;
  isRequired: boolean;
}

export interface DiagnosticSession {
  id: string;
  userId?: string;
  sessionId: string;
  answers: DiagnosticAnswer[];
  recommendations: DiagnosticRecommendation[];
  estimatedCost?: {
    min: number;
    max: number;
  };
  createdAt: Date;
  completedAt?: Date;
}

export interface DiagnosticAnswer {
  questionId: string;
  answer: string | string[] | number;
}

export interface DiagnosticRecommendation {
  type: 'service' | 'part' | 'advice';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost?: number;
  serviceId?: string;
  partId?: string;
}

// Settings and Configuration
export interface SystemSettings {
  general: {
    siteName: string;
    siteUrl: string;
    supportEmail: string;
    supportPhone: string;
    timezone: string;
    currency: string;
    language: string;
  };
  business: {
    workingHours: {
      [key: string]: { start: string; end: string; isOpen: boolean };
    };
    appointmentDuration: number; // minutes
    advanceBookingDays: number;
    cancellationPolicy: string;
  };
  notifications: {
    email: {
      enabled: boolean;
      smtpSettings: any;
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey: string;
    };
    push: {
      enabled: boolean;
      vapidKeys: any;
    };
  };
  payments: {
    stripe: {
      enabled: boolean;
      publicKey: string;
      secretKey: string;
    };
    paypal: {
      enabled: boolean;
      clientId: string;
      clientSecret: string;
    };
  };
  loyalty: {
    enabled: boolean;
    pointsPerRuble: number;
    tierThresholds: {
      silver: number;
      gold: number;
      platinum: number;
    };
  };
} 