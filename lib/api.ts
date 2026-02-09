import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const authAPI = {
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
  
  // Admin user management
  getAllUsers: () =>
    api.get('/auth/users'),
  
  createUser: (data: { email: string; password: string; name: string; phone?: string; role: string }) =>
    api.post('/auth/users', data),
  
  updateUser: (userId: string, data: { role?: string; isActive?: boolean }) =>
    api.put(`/auth/users/${userId}`, data),
};

export const roomsAPI = {
  getAll: () =>
    api.get('/rooms'),
  
  getById: (id: string) =>
    api.get(`/rooms/${id}`),
  
  getAvailable: (checkIn: string, checkOut: string) =>
    api.get(`/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`),
  
  create: (data: any) =>
    api.post('/rooms', data),
  
  update: (id: string, data: any) =>
    api.put(`/rooms/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/rooms/${id}`),
};

export const bookingsAPI = {
  checkAvailability: (data: { roomId: string; checkInDate: string; checkOutDate: string }) =>
    api.post('/bookings/check-availability', data),
  
  create: (data: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    guestInfo: { name: string; email: string; phone: string };
  }) =>
    api.post('/bookings', data),
  
  getAll: () =>
    api.get('/bookings'),
  
  getById: (id: string) =>
    api.get(`/bookings/${id}`),
  
  getByEmail: (email: string) =>
    api.get(`/bookings/user/${email}`),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }),
  
  cancel: (id: string) =>
    api.delete(`/bookings/${id}`),
};

export const contentAPI = {
  getAll: () =>
    api.get('/content'),
  
  getByPage: (pageName: string) =>
    api.get(`/content/${pageName}`),
  
  create: (data: any) =>
    api.post('/content', data),
  
  update: (pageName: string, data: any) =>
    api.put(`/content/${pageName}`, data),
};
