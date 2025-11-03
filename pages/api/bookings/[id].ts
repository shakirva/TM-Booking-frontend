import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Base backend URL (no trailing slash); path is appended below
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
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
