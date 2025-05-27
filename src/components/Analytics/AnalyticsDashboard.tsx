import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchAnalytics, setDateRange } from '../../store/slices/analyticsSlice';
import { MasterAnalytics } from '../../types';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UsersIcon,
  TruckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const AnalyticsDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, dateRange } = useSelector((state: RootState) => state.analytics);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    dispatch(fetchAnalytics({ 
      from: dateRange.from, 
      to: dateRange.to, 
      type: 'overview' 
    }));
  }, [dispatch, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const getRevenueData = () => {
    if (!data?.revenue) return [];
    
    switch (selectedPeriod) {
      case 'daily':
        return data.revenue.daily.map((value, index) => ({
          label: `День ${index + 1}`,
          value,
        }));
      case 'weekly':
        return data.revenue.weekly.map((value, index) => ({
          label: `Неделя ${index + 1}`,
          value,
        }));
      case 'monthly':
        return data.revenue.monthly.map((value, index) => ({
          label: `Месяц ${index + 1}`,
          value,
        }));
      case 'yearly':
        return data.revenue.yearly.map((value, index) => ({
          label: `${new Date().getFullYear() - data.revenue.yearly.length + index + 1}`,
          value,
        }));
      default:
        return [];
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const revenueData = getRevenueData();
  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Аналитика и отчеты
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={dateRange.from.toISOString().split('T')[0]}
              onChange={(e) => dispatch(setDateRange({
                from: new Date(e.target.value),
                to: dateRange.to
              }))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span className="text-gray-500">—</span>
            <input
              type="date"
              value={dateRange.to.toISOString().split('T')[0]}
              onChange={(e) => dispatch(setDateRange({
                from: dateRange.from,
                to: new Date(e.target.value)
              }))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Общая выручка
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.revenue.total)}
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">
                  +{data.revenue.growth}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Всего клиентов
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.customers.totalCustomers)}
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpIcon className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-600 ml-1">
                  +{data.customers.newCustomers} новых
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Средний чек
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.customers.averageOrderValue)}
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpIcon className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-purple-600 ml-1">
                  +12.5%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Склад
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.inventory.inventoryValue)}
              </p>
              <div className="flex items-center mt-1">
                <ArrowDownIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600 ml-1">
                  {data.inventory.lowStockItems} мало
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <TruckIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Выручка
            </h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="daily">По дням</option>
              <option value="weekly">По неделям</option>
              <option value="monthly">По месяцам</option>
              <option value="yearly">По годам</option>
            </select>
          </div>
          
          <div className="space-y-3">
            {revenueData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-20">
                  {item.label}
                </span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.value / maxRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-24 text-right">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Services */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Популярные услуги
          </h3>
          <div className="space-y-4">
            {data.services.mostPopular.map((service, index) => (
              <div key={service.serviceId} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {service.serviceName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {service.count} заказов
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {service.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Эффективность мастеров
          </h3>
          <div className="space-y-4">
            {data.masters.map((master: MasterAnalytics) => (
              <div key={master.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {master.name}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < Math.round(master.averageRating) 
                            ? 'bg-yellow-400' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {master.averageRating}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Заказов:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-1">
                      {master.completedJobs}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Выручка:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-1">
                      {formatCurrency(master.revenue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Эффективность:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-1">
                      {master.efficiency}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Удовлетворенность:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-1">
                      {master.customerSatisfaction}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Состояние склада
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.inventory.totalItems}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Всего позиций
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {data.inventory.lowStockItems}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Мало на складе
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {data.inventory.outOfStockItems}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Нет в наличии
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Топ продаж
              </h4>
              <div className="space-y-2">
                {data.inventory.topSellingParts.map((part) => (
                  <div key={part.partId} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {part.partName}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {part.quantitySold} шт.
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(part.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 