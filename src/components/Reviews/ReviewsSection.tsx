import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchReviews, createReview, respondToReview } from '../../store/slices/reviewsSlice';
import { Review } from '../../types';
import { 
  StarIcon, 
  PhotoIcon, 
  ChatBubbleLeftIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface ReviewsSectionProps {
  masterId?: string;
  serviceStationId?: string;
  clientId?: string;
  showCreateForm?: boolean;
  requestId?: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  masterId, 
  serviceStationId, 
  clientId, 
  showCreateForm = false,
  requestId 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { reviews, loading, averageRating, totalReviews } = useSelector((state: RootState) => state.reviews);
  
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    photos: [] as string[],
  });
  const [responseText, setResponseText] = useState('');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchReviews({ masterId, serviceStationId, clientId }));
  }, [dispatch, masterId, serviceStationId, clientId]);

  const handleCreateReview = async () => {
    if (!user || !requestId) return;

    await dispatch(createReview({
      requestId,
      clientId: user.id,
      masterId: masterId || '',
      serviceStationId: serviceStationId || '',
      rating: newReview.rating,
      comment: newReview.comment,
      photos: newReview.photos,
    }));

    setNewReview({ rating: 5, comment: '', photos: [] });
    setShowForm(false);
  };

  const handleRespondToReview = async (reviewId: string) => {
    if (!user || !responseText.trim()) return;

    await dispatch(respondToReview({
      reviewId,
      responderId: user.id,
      responderRole: user.role,
      content: responseText,
    }));

    setResponseText('');
    setRespondingTo(null);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            {star <= rating ? (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Отзывы и оценки
          </h3>
          {showCreateForm && user?.role === 'client' && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Оставить отзыв</span>
            </button>
          )}
        </div>

        {totalReviews > 0 && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {averageRating}
              </span>
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              На основе {totalReviews} отзыв{totalReviews === 1 ? 'а' : totalReviews < 5 ? 'ов' : 'ов'}
            </div>
          </div>
        )}
      </div>

      {/* Create Review Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Оставить отзыв
              </h4>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Оценка
                </label>
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Комментарий
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Расскажите о качестве обслуживания..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreateReview}
                  disabled={!newReview.comment.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Опубликовать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Загрузка отзывов...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Пока нет отзывов</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    К
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Клиент
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {review.comment}
              </p>

              {/* Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  {review.photos.map((photo, index) => (
                    <div key={index} className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Response */}
              {review.response && (
                <div className="mt-4 ml-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      М
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Ответ мастера
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {formatDate(review.response.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.response.content}
                  </p>
                </div>
              )}

              {/* Response Form */}
              {!review.response && user?.role === 'master' && (
                <div className="mt-4">
                  {respondingTo === review.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Ответить на отзыв..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setRespondingTo(null)}
                          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={() => handleRespondToReview(review.id)}
                          disabled={!responseText.trim()}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                          Ответить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondingTo(review.id)}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      Ответить на отзыв
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection; 