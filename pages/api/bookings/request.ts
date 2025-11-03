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
  if (req.method === 'POST') {
    try {
      if (!BACKEND_BASE) {
        return res.status(500).json({ message: 'Backend URL not configured. Set BACKEND_URL or NEXT_PUBLIC_API_URL env.' });
      }
      const response = await axios.post(`${BACKEND_BASE}/api/bookings/request`, req.body, { headers: req.headers });
      res.status(response.status).json(response.data);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      res.status(err.response?.status || 500).json({ message: err.response?.data?.message || 'Create failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
