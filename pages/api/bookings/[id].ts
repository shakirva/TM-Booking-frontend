import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Base URL for backend booking requests endpoint
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api/bookings/requests';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const bookingId = Array.isArray(id) ? id[0] : id;

  if (req.method === 'PUT') {
    try {
      // Forward PUT request to backend, no token required
      const response = await axios.put(`${BACKEND_URL}/${bookingId}`, req.body, {
        headers: { 'Content-Type': 'application/json' }
      });
      res.status(response.status).json(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unexpected error' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
