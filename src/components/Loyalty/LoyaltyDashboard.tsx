import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchLoyaltyAccount, 
  fetchLoyaltyTransactions, 
  fetchPromotions,
  spendPoints 
} from '../../store/slices/loyaltySlice';
import { LoyaltyTier } from '../../types';
import { 
  StarIcon, 
  GiftIcon, 
  TrophyIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const LoyaltyDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { account, transactions, promotions, loading } = useSelector((state: RootState) => state.loyalty);
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchLoyaltyAccount(user.id));
      dispatch(fetchPromotions(account?.tier));
    }
  }, [dispatch, user, account?.tier]);

  useEffect(() => {
    if (account) {
      dispatch(fetchLoyaltyTransactions(account.id));
    }
  }, [dispatch, account]);

  const getTierInfo = (tier: LoyaltyTier) => {
    switch (tier) {
      case LoyaltyTier.BRONZE:
        return { name: 'Бронза', color: 'text-amber-600', bgColor: 'bg-amber-100', nextTier: 'Серебро', nextThreshold: 2000 };
      case LoyaltyTier.SILVER:
        return { name: 'Серебро', color: 'text-gray-600', bgColor: 'bg-gray-100', nextTier: 'Золото', nextThreshold: 5000 };
      case LoyaltyTier.GOLD:
        return { name: 'Золото', color: 'text-yellow-600', bgColor: 'bg-yellow-100', nextTier: 'Платина', nextThreshold: 10000 };
      case LoyaltyTier.PLATINUM:
        return { name: 'Платина', color: 'text-purple-600', bgColor: 'bg-purple-100', nextTier: null, nextThreshold: null };
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleUsePromotion = async (promotionId: string, pointsCost: number) => {
    if (!account || account.points < pointsCost) return;

    await dispatch(spendPoints({
      accountId: account.id,
      points: pointsCost,
      description: `Использование промо-акции`,
      relatedOrderId: promotionId,
    }));

    setSelectedPromotion(null);
  };

  if (loading || !account) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const tierInfo = getTierInfo(account.tier);
  const progressToNext = tierInfo.nextThreshold 
    ? Math.min((account.totalEarned / tierInfo.nextThreshold) * 100, 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Программа лояльности</h2>
            <p className="text-blue-100">Накапливайте баллы и получайте выгодные предложения</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{account.points}</div>
            <div className="text-blue-100">доступных баллов</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrophyIcon className="h-5 w-5" />
              <span className="font-medium">Статус</span>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tierInfo.bgColor} ${tierInfo.color}`}>
              {tierInfo.name}
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowUpIcon className="h-5 w-5" />
              <span className="font-medium">Заработано</span>
            </div>
            <div className="text-xl font-bold">{account.totalEarned}</div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowDownIcon className="h-5 w-5" />
              <span className="font-medium">Потрачено</span>
            </div>
            <div className="text-xl font-bold">{account.totalSpent}</div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {tierInfo.nextTier && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">До статуса "{tierInfo.nextTier}"</span>
              <span className="text-sm">{account.totalEarned} / {tierInfo.nextThreshold}</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Promotions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <GiftIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Доступные акции
            </h3>
          </div>

          <div className="space-y-4">
            {promotions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Нет доступных акций
              </p>
            ) : (
              promotions.map((promotion) => (
                <div key={promotion.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {promotion.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {promotion.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TagIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {promotion.type === 'discount' ? `${promotion.value}%` : `x${promotion.value}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      До {new Intl.DateTimeFormat('ru-RU').format(new Date(promotion.validTo))}
                    </div>
                    <button
                      onClick={() => setSelectedPromotion(promotion.id)}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      Подробнее
                    </button>
                  </div>

                  <div className="mt-2 bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Использовано: {promotion.usedCount} из {promotion.usageLimit || '∞'}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ 
                          width: promotion.usageLimit 
                            ? `${(promotion.usedCount / promotion.usageLimit) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <ClockIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              История операций
            </h3>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Нет операций
              </p>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'earn' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'earn' ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.points}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Promotion Details Modal */}
      {selectedPromotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            {(() => {
              const promotion = promotions.find(p => p.id === selectedPromotion);
              if (!promotion) return null;

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {promotion.title}
                    </h4>
                    <button
                      onClick={() => setSelectedPromotion(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {promotion.description}
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Тип:</span>
                          <div className="font-medium">
                            {promotion.type === 'discount' ? 'Скидка' : 
                             promotion.type === 'bonus_points' ? 'Бонусные баллы' : 'Бесплатная услуга'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Значение:</span>
                          <div className="font-medium">
                            {promotion.type === 'discount' ? `${promotion.value}%` : `x${promotion.value}`}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Действует до:</span>
                          <div className="font-medium">
                            {new Intl.DateTimeFormat('ru-RU').format(new Date(promotion.validTo))}
                          </div>
                        </div>
                        {promotion.minOrderAmount && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Мин. сумма:</span>
                            <div className="font-medium">{promotion.minOrderAmount} ₽</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedPromotion(null)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Закрыть
                      </button>
                      <button
                        onClick={() => handleUsePromotion(promotion.id, 100)} // Примерная стоимость
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Использовать
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyDashboard; 