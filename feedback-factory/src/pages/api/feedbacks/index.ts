import type { NextApiRequest, NextApiResponse } from 'next';
import { getFeedbacksPaginated, createFeedback } from '@/lib/storage';
import { CreateFeedbackRequest } from '@/types/feedback';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

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

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

function getQueryInt(req: NextApiRequest, key: string, defaultValue: number): number {
  const value = req.query[key];
  if (typeof value === 'string') {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      return num;
    }
  }
  return defaultValue;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      if (!requireAuth(req, res)) return;
      const searchKeyword = typeof req.query.q === 'string' ? req.query.q : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const page = getQueryInt(req, 'page', 1);
      const pageSize = getQueryInt(req, 'pageSize', 10);
      const result = getFeedbacksPaginated(searchKeyword, status, page, pageSize);
      res.status(200).json({
        feedbacks: result.feedbacks,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          total: result.total,
          pageSize,
        },
      });
      break;
    case 'POST':
      try {
        const data: CreateFeedbackRequest = req.body;
        
        if (!data.title || !data.content || !data.category) {
          return res.status(400).json({ error: '请填写标题、内容和类型' });
        }
        
        const email = data.email?.trim();
        const phone = data.phone?.trim();
        
        if (!email && !phone) {
          return res.status(400).json({ error: '请填写邮箱或手机号，以便后续联系' });
        }
        
        if (email && !isValidEmail(email)) {
          return res.status(400).json({ error: '邮箱格式不正确' });
        }
        
        if (phone && !isValidPhone(phone)) {
          return res.status(400).json({ error: '手机号格式不正确，请输入11位手机号' });
        }
        
        const newFeedback = createFeedback({
          ...data,
          email: email || undefined,
          phone: phone || undefined,
        });
        res.status(201).json({ feedback: newFeedback });
      } catch (error) {
        console.error('Create feedback error:', error);
        res.status(500).json({ error: '提交失败，请稍后重试' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
