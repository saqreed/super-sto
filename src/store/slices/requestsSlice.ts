import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ServiceRequest, RequestStatus } from '../../types';
import { requestsAPI } from '../../api/requests';

interface RequestsState {
  requests: ServiceRequest[];
  currentRequest: ServiceRequest | null;
  loading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  requests: [],
  currentRequest: null,
  loading: false,
  error: null,
};

export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (params?: { userId?: string; userRole?: string; status?: string }) => {
    try {
      return await requestsAPI.getAll(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки заявок');
    }
  }
);

export const fetchRequestById = createAsyncThunk(
  'requests/fetchRequestById',
  async (id: string) => {
    try {
      return await requestsAPI.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки заявки');
    }
  }
);

export const fetchRequestsByClient = createAsyncThunk(
  'requests/fetchByClient',
  async (clientId: string) => {
    try {
      return await requestsAPI.getByClient(clientId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки заявок клиента');
    }
  }
);

export const fetchRequestsByMaster = createAsyncThunk(
  'requests/fetchByMaster',
  async (masterId: string) => {
    try {
      return await requestsAPI.getByMaster(masterId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки заявок мастера');
    }
  }
);

export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      return await requestsAPI.create(requestData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка создания заявки');
    }
  }
);

export const updateRequest = createAsyncThunk(
  'requests/updateRequest',
  async ({ id, requestData }: { id: string; requestData: Partial<ServiceRequest> }) => {
    try {
      return await requestsAPI.update(id, requestData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка обновления заявки');
    }
  }
);

export const acceptRequest = createAsyncThunk(
  'requests/acceptRequest',
  async ({ requestId, masterId }: { requestId: string; masterId: string }) => {
    try {
      return await requestsAPI.accept(requestId, masterId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка принятия заявки');
    }
  }
);

export const startRequest = createAsyncThunk(
  'requests/startRequest',
  async (requestId: string) => {
    try {
      return await requestsAPI.start(requestId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка начала выполнения заявки');
    }
  }
);

export const completeRequest = createAsyncThunk(
  'requests/completeRequest',
  async ({ requestId, completionData }: { requestId: string; completionData: any }) => {
    try {
      return await requestsAPI.complete(requestId, completionData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка завершения заявки');
    }
  }
);

export const cancelRequest = createAsyncThunk(
  'requests/cancelRequest',
  async ({ requestId, reason }: { requestId: string; reason: string }) => {
    try {
      return await requestsAPI.cancel(requestId, reason);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка отмены заявки');
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'requests/updateRequestStatus',
  async ({ requestId, status }: { requestId: string; status: RequestStatus }) => {
    try {
      return await requestsAPI.updateStatus(requestId, status);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка обновления статуса заявки');
    }
  }
);

export const addRequestComment = createAsyncThunk(
  'requests/addComment',
  async ({ requestId, comment }: { requestId: string; comment: string }) => {
    try {
      return await requestsAPI.addComment(requestId, comment);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка добавления комментария');
    }
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload;
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заявок';
      })
      .addCase(fetchRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
        const existingIndex = state.requests.findIndex(r => r.id === action.payload.id);
        if (existingIndex >= 0) {
          state.requests[existingIndex] = action.payload;
        } else {
          state.requests.push(action.payload);
        }
      })
      .addCase(fetchRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заявки';
      })
      .addCase(fetchRequestsByClient.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      .addCase(fetchRequestsByMaster.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка создания заявки';
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index >= 0) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index >= 0) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(startRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index >= 0) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(completeRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index >= 0) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index >= 0) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index >= 0) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      });
  },
});

export const { clearError, setCurrentRequest, clearCurrentRequest } = requestsSlice.actions;
export default requestsSlice.reducer; 