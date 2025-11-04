import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api/bookings/request';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(BACKEND_URL, req.body, { headers: req.headers });
      res.status(response.status).json(response.data);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      res.status(err.response?.status || 500).json({ message: err.response?.data?.message || 'Create failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
