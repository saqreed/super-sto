// Размеры пагинации
export const PAGINATION_SIZES = {
  SMALL: 5,
  MEDIUM: 10,
  LARGE: 20,
  EXTRA_LARGE: 50,
} as const;

// Время дебаунса для поиска
export const SEARCH_DEBOUNCE_TIME = 300;

// Время автоматического скрытия уведомлений
export const NOTIFICATION_DURATION = 4500;

// Максимальные размеры файлов
export const FILE_UPLOAD_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Поддерживаемые форматы файлов
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const SUPPORTED_DOCUMENT_FORMATS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

// Цвета для статусов
export const STATUS_COLORS = {
  PENDING: '#faad14',
  CONFIRMED: '#52c41a',
  IN_PROGRESS: '#1890ff',
  COMPLETED: '#389e0d',
  CANCELLED: '#f5222d',
  PROCESSING: '#13c2c2',
  SHIPPED: '#722ed1',
  DELIVERED: '#52c41a',
} as const;

// Локальные ключи для localStorage
export const LOCAL_STORAGE_KEYS = {
  THEME: 'supersto_theme',
  LANGUAGE: 'supersto_language',
  SIDEBAR_COLLAPSED: 'supersto_sidebar_collapsed',
  FILTERS: 'supersto_filters',
} as const;

// Валидация
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_PATTERN: /^(\+7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Сообщения
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  UNAUTHORIZED: 'Необходимо войти в систему.',
  FORBIDDEN: 'У вас нет прав для выполнения этого действия.',
  NOT_FOUND: 'Запрашиваемый ресурс не найден.',
  SERVER_ERROR: 'Внутренняя ошибка сервера. Попробуйте позже.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Успешный вход в систему!',
  LOGOUT_SUCCESS: 'Вы успешно вышли из системы.',
  PROFILE_UPDATED: 'Профиль успешно обновлен.',
  ITEM_CREATED: 'Элемент успешно создан.',
  ITEM_UPDATED: 'Элемент успешно обновлен.',
  ITEM_DELETED: 'Элемент успешно удален.',
} as const;

// Роли и их переводы
export const ROLE_LABELS = {
  CLIENT: 'Клиент',
  MASTER: 'Мастер', 
  ADMIN: 'Администратор',
} as const;

// Статусы и их переводы
export const STATUS_LABELS = {
  PENDING: 'Ожидание',
  CONFIRMED: 'Подтверждено',
  IN_PROGRESS: 'В процессе',
  COMPLETED: 'Завершено',
  CANCELLED: 'Отменено',
  PROCESSING: 'Обработка',
  SHIPPED: 'Отправлено',
  DELIVERED: 'Доставлено',
} as const;

// Категории услуг и их переводы
export const SERVICE_CATEGORY_LABELS = {
  MAINTENANCE: 'Техническое обслуживание',
  REPAIR: 'Ремонт',
  BODY_WORK: 'Кузовные работы',
  DIAGNOSTIC: 'Диагностика',
  DETAILING: 'Детейлинг',
} as const;

// Уровни лояльности и их переводы
export const LOYALTY_LEVEL_LABELS = {
  BRONZE: 'Бронзовый',
  SILVER: 'Серебряный',
  GOLD: 'Золотой',
  PLATINUM: 'Платиновый',
} as const;

// Настройки по умолчанию
export const DEFAULT_SETTINGS = {
  ITEMS_PER_PAGE: PAGINATION_SIZES.MEDIUM,
  THEME: 'light',
  LANGUAGE: 'ru',
  SIDEBAR_COLLAPSED: false,
} as const; 