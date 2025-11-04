import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Resolve backend base URL from env:
// 1) BACKEND_URL takes precedence (no trailing slash)
// 2) Fallback to NEXT_PUBLIC_API_URL with trailing /api removed
const BACKEND_BASE =
  process.env.BACKEND_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/?api\/?$/, '')
    : undefined);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      if (!BACKEND_BASE) {
        return res.status(500).json({ message: 'Backend URL not configured. Set BACKEND_URL or NEXT_PUBLIC_API_URL env.' });
      }
      // Forward PUT request to backend, no token required
      const response = await axios.put(`${BACKEND_BASE}/api/bookings/requests/${id}`, req.body, {
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
