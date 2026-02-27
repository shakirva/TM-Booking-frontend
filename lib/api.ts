export const updateBooking = async (id: string, updates: Record<string, unknown>, token: string) => {
  // If API_URL is configured, call backend directly; otherwise use Next API proxy
  if (API_URL) {
    const res = await axios.put(`${API_URL}/bookings/requests/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
  const res = await axios.put(`/api/bookings/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteUser = async (id: string, token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
// User management
export const getUsers = async (token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addUser = async (data: { username: string; password: string; role: string }, token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.post(`${API_URL}/users`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
import axios from 'axios';

// Prefer runtime-configured public API URL; avoid falling back to localhost in production
// If not provided, for selected endpoints we will call Next.js API routes as a safe proxy.
const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g., https://api.example.com/api

// Update user profile (name, profile image)
export const updateProfile = async (data: { name: string; profileImage: string }, token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.put(`${API_URL}/users/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Change user password
export const changePassword = async (data: { currentPassword: string; newPassword: string }, token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.put(`${API_URL}/users/password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const login = async (username: string, password: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.post(`${API_URL}/auth/login`, { username, password });
  return res.data;
};

export const getSlots = async (token?: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await axios.get(`${API_URL}/bookings/slots`, { headers });
  return res.data;
};

export const createSlot = async (slot: Record<string, unknown>, token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.post(`${API_URL}/bookings/slots`, slot, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getRequests = async (token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.get(`${API_URL}/bookings/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getDeletedBookings = async (token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.get(`${API_URL}/bookings/deleted`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateRequestStatus = async (id: number, status: string, token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.put(`${API_URL}/bookings/requests/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createBookingRequest = async (data: Record<string, unknown>) => {
  // If API_URL is configured, hit backend directly; otherwise use Next API proxy
  if (API_URL) {
    const res = await axios.post(`${API_URL}/bookings/request`, data);
    return res.data;
  }
  const res = await axios.post(`/api/bookings/request`, data);
  return res.data;
};

export const getDashboardSummary = async (token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.get(`${API_URL}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get upcoming events for dashboard
export const getUpcomingEvents = async (token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.get(`${API_URL}/dashboard/upcoming-events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Slot Pricing APIs
export const getSlotPricing = async () => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.get(`${API_URL}/bookings/pricing`);
  return res.data;
};

export const getSlotPriceForDate = async (slotName: string, eventDate: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.get(`${API_URL}/bookings/pricing/${slotName}?eventDate=${eventDate}`);
  return res.data;
};

export const calculateTotalAmount = async (slotName: string, eventDate: string, includeNight: boolean) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.post(`${API_URL}/bookings/calculate-total`, {
    slotName,
    eventDate,
    includeNight
  });
  return res.data;
};

export const updateSlotPricing = async (slotName: string, pricing: { current_price: number; future_price?: number; effective_from?: string }, token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.put(`${API_URL}/bookings/pricing/${slotName}`, pricing, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteBooking = async (id: string, token: string) => {
  if (!API_URL) throw new Error('API base URL not configured');
  const res = await axios.delete(`${API_URL}/bookings/requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
