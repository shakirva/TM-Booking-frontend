import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL; // e.g., https://api.example.com

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      if (!BACKEND_URL) {
        return res.status(500).json({ message: 'Backend URL not configured. Set BACKEND_URL env.' });
      }
      const response = await axios.post(`${BACKEND_URL}/api/bookings/request`, req.body, { headers: req.headers });
      res.status(response.status).json(response.data);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      res.status(err.response?.status || 500).json({ message: err.response?.data?.message || 'Create failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
