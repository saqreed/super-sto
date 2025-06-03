import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewsAPI } from '../../api/reviews';
import { Review } from '../../types';

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

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params?: { masterId?: string; serviceStationId?: string; clientId?: string }) => {
    try {
      let response;
      
      if (params?.masterId) {
        response = await reviewsAPI.getByMaster(params.masterId);
      } else if (params?.serviceStationId) {
        response = await reviewsAPI.getByStation(params.serviceStationId);
      } else if (params?.clientId) {
        response = await reviewsAPI.getByClient(params.clientId);
      } else {
        response = await reviewsAPI.getAll(params);
      }
      
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки отзывов');
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  'reviews/fetchReviewById',
  async (id: string) => {
    try {
      return await reviewsAPI.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки отзыва');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData: Omit<Review, 'id' | 'createdAt' | 'response'>) => {
    try {
      return await reviewsAPI.create(reviewData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка создания отзыва');
    }
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
    try {
      return await reviewsAPI.respond(responseData.reviewId, {
        responderId: responseData.responderId,
        responderRole: responseData.responderRole,
        content: responseData.content,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка ответа на отзыв');
    }
  }
);

export const uploadReviewPhoto = createAsyncThunk(
  'reviews/uploadPhoto',
  async (data: { reviewId: string; photo: File }) => {
    try {
      return await reviewsAPI.uploadPhoto(data.reviewId, data.photo);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки фото');
    }
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
        const data = action.payload;
        
        if (Array.isArray(data)) {
          state.reviews = data;
          state.totalReviews = data.length;
          state.averageRating = data.length > 0 
            ? Math.round((data.reduce((sum, review) => sum + review.rating, 0) / data.length) * 10) / 10
            : 0;
        } else {
          state.reviews = data.reviews || [];
          state.totalReviews = data.totalReviews || 0;
          state.averageRating = data.averageRating || 0;
        }
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки отзывов';
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        const existingIndex = state.reviews.findIndex(r => r.id === action.payload.id);
        if (existingIndex >= 0) {
          state.reviews[existingIndex] = action.payload;
        } else {
          state.reviews.push(action.payload);
        }
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
        state.totalReviews += 1;
        
        // Recalculate average rating
        const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0);
        state.averageRating = Math.round((totalRating / state.totalReviews) * 10) / 10;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка создания отзыва';
      })
      .addCase(respondToReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToReview.fulfilled, (state, action) => {
        state.loading = false;
        const review = state.reviews.find(r => r.id === action.payload.reviewId);
        if (review) {
          review.response = action.payload;
        }
      })
      .addCase(respondToReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка ответа на отзыв';
      })
      .addCase(uploadReviewPhoto.fulfilled, (state, action) => {
        const review = state.reviews.find(r => r.id === action.payload.reviewId);
        if (review) {
          review.photos = review.photos || [];
          review.photos.push(action.payload.photoUrl);
        }
      });
  },
});

export const { clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer; 