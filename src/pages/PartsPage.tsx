import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchParts, setSearchQuery, setSelectedCategory, setSelectedBrand, clearFilters } from '../store/slices/partsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Part } from '../types';

const PartsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredParts, loading, searchQuery, selectedCategory, selectedBrand } = useAppSelector(state => state.parts);
  const { user } = useAppSelector(state => state.auth);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchParts());
  }, [dispatch]);

  const handleAddToCart = (part: Part) => {
    if (!user) {
      dispatch(addNotification({
        userId: '',
        title: 'Требуется авторизация',
        message: 'Войдите в аккаунт для добавления товаров в корзину',
        type: 'warning',
        read: false
      }));
      return;
    }

    dispatch(addToCart(part));
    dispatch(addNotification({
      userId: user.id,
      title: 'Товар добавлен',
      message: `${part.name} добавлен в корзину`,
      type: 'success',
      read: false
    }));
  };

  const categories = Array.from(new Set(filteredParts.map(part => part.category)));
  const brands = Array.from(new Set(filteredParts.map(part => part.brand)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Каталог запчастей
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary flex items-center"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Фильтры
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card p-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Фильтры
              </h3>
              <button
                onClick={() => dispatch(clearFilters())}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Сбросить
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Поиск
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  placeholder="Поиск по названию, артикулу..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Категория
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
                className="input-field"
              >
                <option value="">Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Бренд
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => dispatch(setSelectedBrand(e.target.value))}
                className="input-field"
              >
                <option value="">Все бренды</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Найдено товаров: {filteredParts.length}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredParts.map((part) => (
                  <div key={part.id} className="card overflow-hidden">
                    {/* Product Image */}
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="text-gray-400 text-4xl">📦</div>
                    </div>

                    <div className="p-4">
                      {/* Product Info */}
                      <div className="mb-2">
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                          {part.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {part.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {part.description}
                      </p>

                      <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <div>Бренд: {part.brand}</div>
                        <div>Модель: {part.model}</div>
                        <div>Артикул: {part.article}</div>
                      </div>

                      {/* Stock Status */}
                      <div className="mb-4">
                        {part.inStock ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            В наличии ({part.quantity} шт.)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Нет в наличии
                          </span>
                        )}
                      </div>

                      {/* Price and Add to Cart */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {part.price.toLocaleString()} ₽
                        </span>
                        
                        <button
                          onClick={() => handleAddToCart(part)}
                          disabled={!part.inStock}
                          className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCartIcon className="h-4 w-4 mr-1" />
                          В корзину
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredParts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Товары не найдены
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartsPage; 