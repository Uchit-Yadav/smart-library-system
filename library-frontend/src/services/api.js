import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token expires (401), auto-logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sl_token');
      localStorage.removeItem('sl_user');
      window.location.hash = '/login';
    }
    return Promise.reject(error);
  }
);

const mockAPI = {
  login: async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    return data;
  },
  register: async (data) => {
    const { data: result } = await API.post('/auth/register', data);
    return result;
  },
  getMyBookings: async () => {
    const { data } = await API.get('/bookings/my-bookings');
    return data;
  },
  getAllBookings: async () => {
    const { data } = await API.get('/admin/bookings');
    return data;
  },
  getAvailableSeats: async (filters) => {
    const params = {};
    if (filters.floor) params.floor = filters.floor;
    if (filters.section) params.section = filters.section;
    const { data } = await API.get('/seats/available', { params });
    return data;
  },
  getAllSeats: async () => {
    const { data } = await API.get('/seats');
    return data;
  },
  createBooking: async (bookingData) => {
    const { data } = await API.post('/bookings', bookingData);
    return data;
  },
  cancelBooking: async (id) => {
    const { data } = await API.put(`/bookings/${id}/cancel`);
    return data;
  },
  getAllUsers: async () => {
    const { data } = await API.get('/admin/users');
    return data;
  },
  deleteUser: async (id) => {
    const { data } = await API.delete(`/admin/users/${id}`);
    return data;
  },
  getDashboardStats: async () => {
    const { data } = await API.get('/admin/dashboard');
    return data;
  },
  createSeat: async (seatData) => {
    const { data } = await API.post('/seats', seatData);
    return data;
  },
  deleteSeat: async (id) => {
    const { data } = await API.delete(`/seats/${id}`);
    return data;
  },
};

export default mockAPI;
