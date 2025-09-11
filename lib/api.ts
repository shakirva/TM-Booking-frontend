export const updateBooking = async (id: string, updates: Record<string, any>, token: string) => {
  const res = await axios.put(`${API_URL}/bookings/requests/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const deleteUser = async (id: string, token: string) => {
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
// User management
export const getUsers = async (token: string) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addUser = async (data: { username: string; password: string; role: string }, token: string) => {
  const res = await axios.post(`${API_URL}/users`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Update user profile (name, profile image)
export const updateProfile = async (data: { name: string; profileImage: string }, token: string) => {
  const res = await axios.put(`${API_URL}/users/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Change user password
export const changePassword = async (data: { currentPassword: string; newPassword: string }, token: string) => {
  const res = await axios.put(`${API_URL}/users/password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const login = async (username: string, password: string) => {
  const res = await axios.post(`${API_URL}/auth/login`, { username, password });
  return res.data;
};

export const getSlots = async (token: string) => {
  const res = await axios.get(`${API_URL}/bookings/slots`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createSlot = async (slot: Record<string, unknown>, token: string) => {
  const res = await axios.post(`${API_URL}/bookings/slots`, slot, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getRequests = async (token: string) => {
  const res = await axios.get(`${API_URL}/bookings/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateRequestStatus = async (id: number, status: string, token: string) => {
  const res = await axios.put(`${API_URL}/bookings/requests/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createBookingRequest = async (data: Record<string, unknown>) => {
  const res = await axios.post(`${API_URL}/bookings/request`, data);
  return res.data;
};

export const getDashboardSummary = async (token: string) => {
  const res = await axios.get(`${API_URL}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteBooking = async (id: string, token: string) => {
  const res = await axios.delete(`${API_URL}/bookings/requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
