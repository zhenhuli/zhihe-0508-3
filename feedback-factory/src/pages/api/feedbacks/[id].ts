import type { NextApiRequest, NextApiResponse } from 'next';
import { getFeedbackById, updateFeedbackStatus } from '@/lib/storage';
import { FeedbackStatus, UpdateFeedbackStatusRequest } from '@/types/feedback';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

const validStatuses: FeedbackStatus[] = ['pending', 'processing', 'resolved'];

function requireAuth(req: NextApiRequest, res: NextApiResponse): boolean {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: '未登录，请先登录' });
    return false;
  }
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: '登录已过期，请重新登录' });
    return false;
  }
  return true;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid feedback ID' });
  }

  switch (req.method) {
    case 'GET':
      if (!requireAuth(req, res)) return;
      const feedback = getFeedbackById(id);
      if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }
      res.status(200).json({ feedback });
      break;
    case 'PATCH':
      if (!requireAuth(req, res)) return;
      try {
        const data: UpdateFeedbackStatusRequest = req.body;
        if (!data.status || !validStatuses.includes(data.status)) {
          return res.status(400).json({ error: 'Invalid status' });
        }
        const updated = updateFeedbackStatus(id, data.status);
        if (!updated) {
          return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json({ feedback: updated });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update feedback' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PATCH']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
