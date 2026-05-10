import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyCredentials, generateToken } from '@/lib/auth';
import { LoginRequest, LoginResponse } from '@/types/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '请输入用户名和密码' });
    }

    if (!verifyCredentials(username, password)) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = generateToken(username);
    const oneDay = 24 * 60 * 60 * 1000;

    res.setHeader('Set-Cookie', [
      `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${oneDay / 1000}`,
    ]);

    const response: LoginResponse = {
      token,
      user: { username },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '登录失败，请稍后重试' });
  }
}
