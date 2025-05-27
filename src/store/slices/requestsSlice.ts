import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ServiceRequest, RequestStatus } from '../../types';

interface RequestsState {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  requests: [],
  loading: false,
  error: null,
};

export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (params?: { userId?: string; userRole?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockRequests: ServiceRequest[] = [
      {
        id: '1',
        clientId: '1',
        serviceStationId: '1',
        serviceId: '1',
        masterId: '2',
        status: RequestStatus.IN_PROGRESS,
        scheduledDate: new Date('2024-01-15T10:00:00'),
        description: 'Замена масла в двигателе',
        createdAt: new Date('2024-01-10T09:00:00'),
        updatedAt: new Date('2024-01-14T15:30:00'),
      },
      {
        id: '2',
        clientId: '1',
        serviceStationId: '1',
        serviceId: '2',
        status: RequestStatus.PENDING,
        scheduledDate: new Date('2024-01-20T14:00:00'),
        description: 'Диагностика двигателя',
        createdAt: new Date('2024-01-12T11:00:00'),
        updatedAt: new Date('2024-01-12T11:00:00'),
      },
      {
        id: '3',
        clientId: '3',
        serviceStationId: '1',
        serviceId: '3',
        masterId: '2',
        status: RequestStatus.COMPLETED,
        scheduledDate: new Date('2024-01-10T09:00:00'),
        description: 'Ремонт тормозной системы',
        createdAt: new Date('2024-01-08T10:00:00'),
        updatedAt: new Date('2024-01-10T16:00:00'),
        report: 'Заменены тормозные колодки и диски. Система работает исправно.',
      },
      {
        id: '4',
        clientId: '4',
        serviceStationId: '2',
        serviceId: '1',
        status: RequestStatus.PENDING,
        scheduledDate: new Date('2024-01-25T11:00:00'),
        description: 'Плановое ТО',
        createdAt: new Date('2024-01-15T14:00:00'),
        updatedAt: new Date('2024-01-15T14:00:00'),
      },
    ];
    
    if (!params?.userId) {
      return mockRequests;
    }
    
    // Фильтрация по роли пользователя
    if (params.userRole === 'client') {
      return mockRequests.filter(req => req.clientId === params.userId);
    } else if (params.userRole === 'master') {
      return mockRequests.filter(req => req.masterId === params.userId);
    } else if (params.userRole === 'admin') {
      return mockRequests; // Админ видит все заявки
    }
    
    return mockRequests;
  }
);

export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRequest: ServiceRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return newRequest;
  }
);

export const updateRequestStatus = createAsyncThunk(
  'requests/updateStatus',
  async ({ requestId, status }: { requestId: string; status: RequestStatus }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { requestId, status };
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заявок';
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload);
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const request = state.requests.find(req => req.id === action.payload.requestId);
        if (request) {
          request.status = action.payload.status;
          request.updatedAt = new Date();
        }
      });
  },
});

export default requestsSlice.reducer; 