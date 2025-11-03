import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Base backend URL (no trailing slash); must be provided at runtime (e.g., https://api.example.com)
const BACKEND_URL = process.env.BACKEND_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      if (!BACKEND_URL) {
        return res.status(500).json({ message: 'Backend URL not configured. Set BACKEND_URL env.' });
      }
      // Forward PUT request to backend, no token required
      const response = await axios.put(`${BACKEND_URL}/api/bookings/requests/${id}`, req.body, {
        headers: { 'Content-Type': 'application/json' }
      });
      res.status(response.status).json(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status ?? 500;
        const data = err.response?.data ?? { message: err.message };
        res.status(status).json(data);
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
