import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { VALIDATION_RULES } from '../constants';

// Форматирование дат
export const formatDate = (date: string | Date, formatString: string = 'dd.MM.yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: ru });
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd.MM.yyyy HH:mm');
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, 'dd.MM');
};

export const formatDateLong = (date: string | Date): string => {
  return formatDate(date, 'dd MMMM yyyy');
};

// Форматирование валюты
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(amount);
};

// Форматирование чисел
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('ru-RU').format(number);
};

// Форматирование рейтинга
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// Получение инициалов пользователя
export const getUserInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
};

// Получение полного имени пользователя
export const getUserFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

// Сокращение имени (только имя и первая буква фамилии)
export const getShortName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
};

// Проверка валидности email
export const isValidEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL_PATTERN.test(email);
};

// Проверка валидности телефона
export const isValidPhone = (phone: string): boolean => {
  return VALIDATION_RULES.PHONE_PATTERN.test(phone);
};

// Форматирование телефона
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  if (cleaned.length === 10) {
    return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`;
  }
  return phone;
};

// Генерация случайного цвета для аватара
export const getRandomColor = (): string => {
  const colors = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#52c41a',
    '#eb2f96', '#722ed1', '#13c2c2', '#fa541c', '#1890ff'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Получение цвета по строке (детерминированный)
export const getColorFromString = (str: string): string => {
  const colors = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#52c41a',
    '#eb2f96', '#722ed1', '#13c2c2', '#fa541c', '#1890ff'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Дебаунс функция
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle функция
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Сокращение текста
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Капитализация первой буквы
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Преобразование в camelCase
export const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
};

// Преобразование в kebab-case
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/^-/, '');
};

// Генерация уникального ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Проверка пустого объекта
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Глубокое клонирование объекта
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const cloned = {} as any;
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  return obj;
};

// Вычисление размера файла в читаемом формате
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Валидация силы пароля
export const getPasswordStrength = (password: string): {
  score: number;
  message: string;
} => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const messages = [
    'Очень слабый',
    'Слабый',
    'Средний',
    'Хороший',
    'Сильный',
    'Очень сильный'
  ];

  return {
    score,
    message: messages[score] || 'Очень слабый'
  };
}; 