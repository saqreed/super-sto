import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon,
  ShoppingBagIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalAmount, totalItems } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.auth);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleUpdateQuantity = (partId: string, newQuantity: number) => {
    dispatch(updateQuantity({ partId, quantity: newQuantity }));
  };

  const handleRemoveItem = (partId: string, partName: string) => {
    dispatch(removeFromCart(partId));
    if (user) {
      dispatch(addNotification({
        userId: user.id,
        title: 'Товар удален',
        message: `${partName} удален из корзины`,
        type: 'info',
        read: false
      }));
    }
  };

  const handleCheckout = () => {
    if (!user) {
      dispatch(addNotification({
        userId: '',
        title: 'Требуется авторизация',
        message: 'Войдите в аккаунт для оформления заказа',
        type: 'warning',
        read: false
      }));
      return;
    }

    // Здесь будет логика оформления заказа
    dispatch(addNotification({
      userId: user.id,
      title: 'Заказ оформлен',
      message: `Заказ на сумму ${totalAmount.toLocaleString()} ₽ успешно оформлен`,
      type: 'success',
      read: false
    }));
    
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Корзина
        </h1>
        
        <div className="text-center py-12">
          <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Корзина пуста
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Добавьте товары из каталога запчастей
          </p>
          <Link to="/parts" className="btn-primary">
            Перейти к каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Корзина ({totalItems} товаров)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.part.id} className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-gray-400 text-2xl">📦</div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.part.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.part.brand} • {item.part.article}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {item.part.price.toLocaleString()} ₽
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.part.id, item.quantity - 1)}
                      className="p-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      disabled={item.quantity <= 1}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleUpdateQuantity(item.part.id, item.quantity + 1)}
                      className="p-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      disabled={item.quantity >= item.part.quantity}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Total Price */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(item.part.price * item.quantity).toLocaleString()} ₽
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.part.id, item.part.name)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => dispatch(clearCart())}
                className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Итого к оплате
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Товары ({totalItems} шт.)</span>
                <span className="font-medium">{totalAmount.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Доставка</span>
                <span className="font-medium">
                  {deliveryType === 'pickup' ? 'Бесплатно' : '500 ₽'}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Итого</span>
                  <span>{(totalAmount + (deliveryType === 'delivery' ? 500 : 0)).toLocaleString()} ₽</span>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Способ получения
              </h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="pickup"
                    checked={deliveryType === 'pickup'}
                    onChange={(e) => setDeliveryType(e.target.value as 'pickup')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Самовывоз (бесплатно)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="delivery"
                    checked={deliveryType === 'delivery'}
                    onChange={(e) => setDeliveryType(e.target.value as 'delivery')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Доставка (500 ₽)
                  </span>
                </label>
              </div>
            </div>

            {/* Delivery Address */}
            {deliveryType === 'delivery' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Адрес доставки
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Введите адрес доставки"
                  className="input-field"
                  rows={3}
                />
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full btn-primary flex items-center justify-center"
            >
              <CreditCardIcon className="h-5 w-5 mr-2" />
              Оформить заказ
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/parts"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Продолжить покупки
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 