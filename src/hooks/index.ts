import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { debounce } from '../utils';

// Хук для дебаунсированного поиска
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Хук для локального хранения
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка чтения из localStorage для ключа "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Ошибка записи в localStorage для ключа "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Хук для пагинации
export const usePagination = (totalItems: number, itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPrevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  const pagination = useMemo(() => ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  }), [currentPage, totalPages, startIndex, endIndex, itemsPerPage]);

  return {
    ...pagination,
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    setCurrentPage,
  };
};

// Хук для управления состоянием загрузки
export const useLoading = (initialState: boolean = false) => {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      const result = await fn();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return { loading, startLoading, stopLoading, withLoading };
};

// Хук для фильтрации и поиска
export const useFilter = <T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  additionalFilters?: Record<string, any>
) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  return useMemo(() => {
    let filtered = items;

    // Поиск по тексту
    if (debouncedSearchTerm) {
      const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && 
            String(value).toLowerCase().includes(lowerSearchTerm);
        })
      );
    }

    // Дополнительные фильтры
    if (additionalFilters) {
      filtered = filtered.filter(item => {
        return Object.entries(additionalFilters).every(([key, value]) => {
          if (value === null || value === undefined || value === '') {
            return true;
          }
          return item[key as keyof T] === value;
        });
      });
    }

    return filtered;
  }, [items, debouncedSearchTerm, searchFields, additionalFilters]);
};

// Хук для работы с корзиной
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.products.cart);

  const cartTotal = useMemo(() => 
    cart.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    [cart]
  );

  const cartItemsCount = useMemo(() => 
    cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const getCartItemQuantity = useCallback((productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    return item?.quantity || 0;
  }, [cart]);

  const isInCart = useCallback((productId: string) => {
    return cart.some(item => item.product.id === productId);
  }, [cart]);

  return {
    cart,
    cartTotal,
    cartItemsCount,
    getCartItemQuantity,
    isInCart,
  };
};

// Хук для проверки прав доступа
export const usePermissions = () => {
  const user = useAppSelector(state => state.auth.user);

  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user?.role]);
  const isMaster = useMemo(() => user?.role === 'MASTER', [user?.role]);
  const isClient = useMemo(() => user?.role === 'CLIENT', [user?.role]);

  const canManageUsers = useMemo(() => isAdmin, [isAdmin]);
  const canManageServices = useMemo(() => isAdmin, [isAdmin]);
  const canViewReports = useMemo(() => isAdmin, [isAdmin]);
  const canManageAppointments = useMemo(() => isAdmin || isMaster, [isAdmin, isMaster]);

  return {
    user,
    isAdmin,
    isMaster,
    isClient,
    canManageUsers,
    canManageServices,
    canViewReports,
    canManageAppointments,
  };
};

// Хук для обработки ошибок API
export const useApiError = () => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((error: any) => {
    const message = error?.response?.data?.message || 
                   error?.message || 
                   'Произошла неизвестная ошибка';
    setError(message);
  }, []);

  return { error, clearError, handleError };
}; 