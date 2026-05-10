import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const token = getTokenFromRequest(req);
  
  if (!token) {
    return res.status(401).json({ error: '未登录' });
  }

  const user = verifyToken(token);
  
  if (!user) {
    return res.status(401).json({ error: '登录已过期' });
  }

  res.status(200).json({ user });
}
