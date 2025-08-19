import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://39db07157de0.ngrok-free.app/api';

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
