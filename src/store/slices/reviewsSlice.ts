import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Review, ReviewResponse } from '../../types';

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  averageRating: number;
  totalReviews: number;
}

const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
  averageRating: 0,
  totalReviews: 0,
};

// Mock data
const mockReviews: Review[] = [
  {
    id: '1',
    requestId: '3',
    clientId: '3',
    masterId: '2',
    serviceStationId: '1',
    rating: 5,
    comment: 'Отличная работа! Мастер очень профессиональный, все объяснил и показал. Машина работает как новая!',
    photos: ['/uploads/review1_1.jpg', '/uploads/review1_2.jpg'],
    createdAt: new Date('2024-01-11T16:00:00'),
    response: {
      id: '1',
      reviewId: '1',
      responderId: '2',
      responderRole: 'master' as any,
      content: 'Спасибо за отзыв! Было приятно работать с вами. Обращайтесь, если понадобится помощь!',
      createdAt: new Date('2024-01-11T18:00:00'),
    },
  },
  {
    id: '2',
    requestId: '2',
    clientId: '1',
    masterId: '2',
    serviceStationId: '1',
    rating: 4,
    comment: 'Хорошая работа, но пришлось немного подождать. В целом доволен результатом.',
    createdAt: new Date('2024-01-20T15:00:00'),
  },
];

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params?: { masterId?: string; serviceStationId?: string; clientId?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredReviews = mockReviews;
    
    if (params?.masterId) {
      filteredReviews = filteredReviews.filter(r => r.masterId === params.masterId);
    }
    
    if (params?.serviceStationId) {
      filteredReviews = filteredReviews.filter(r => r.serviceStationId === params.serviceStationId);
    }
    
    if (params?.clientId) {
      filteredReviews = filteredReviews.filter(r => r.clientId === params.clientId);
    }
    
    const totalReviews = filteredReviews.length;
    const averageRating = totalReviews > 0 
      ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    
    return {
      reviews: filteredReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
    };
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData: Omit<Review, 'id' | 'createdAt' | 'response'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    return newReview;
  }
);

export const respondToReview = createAsyncThunk(
  'reviews/respondToReview',
  async (responseData: {
    reviewId: string;
    responderId: string;
    responderRole: string;
    content: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response: ReviewResponse = {
      id: Date.now().toString(),
      reviewId: responseData.reviewId,
      responderId: responseData.responderId,
      responderRole: responseData.responderRole as any,
      content: responseData.content,
      createdAt: new Date(),
    };
    
    return response;
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.averageRating = action.payload.averageRating;
        state.totalReviews = action.payload.totalReviews;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки отзывов';
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
        state.totalReviews += 1;
        
        // Recalculate average rating
        const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0);
        state.averageRating = Math.round((totalRating / state.totalReviews) * 10) / 10;
      })
      .addCase(respondToReview.fulfilled, (state, action) => {
        const review = state.reviews.find(r => r.id === action.payload.reviewId);
        if (review) {
          review.response = action.payload;
        }
      });
  },
});

export const { clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer; 