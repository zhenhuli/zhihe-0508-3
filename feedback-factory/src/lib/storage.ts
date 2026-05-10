import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Feedback, FeedbackStatus, CreateFeedbackRequest } from '@/types/feedback';

const dataDir = path.join(process.cwd(), 'data');
const feedbacksFile = path.join(dataDir, 'feedbacks.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readFeedbacks(): Feedback[] {
  ensureDataDir();
  if (!fs.existsSync(feedbacksFile)) {
    return [];
  }
  try {
    const content = fs.readFileSync(feedbacksFile, 'utf-8');
    if (!content.trim()) {
      return [];
    }
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading feedbacks file:', error);
    return [];
  }
}

function writeFeedbacks(feedbacks: Feedback[]): void {
  ensureDataDir();
  fs.writeFileSync(feedbacksFile, JSON.stringify(feedbacks, null, 2), 'utf-8');
}

export function getAllFeedbacks(searchKeyword?: string, status?: string): Feedback[] {
  let feedbacks = readFeedbacks();
  
  if (searchKeyword && searchKeyword.trim()) {
    const keyword = searchKeyword.trim().toLowerCase();
    feedbacks = feedbacks.filter(f => 
      (f.email && f.email.toLowerCase().includes(keyword)) ||
      (f.phone && f.phone.toLowerCase().includes(keyword))
    );
  }
  
  if (status && status !== 'all') {
    feedbacks = feedbacks.filter(f => f.status === status);
  }
  
  return feedbacks.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getFeedbacksPaginated(
  searchKeyword?: string,
  status?: string,
  page: number = 1,
  pageSize: number = 10
): { feedbacks: Feedback[]; total: number; totalPages: number; currentPage: number } {
  const allFeedbacks = getAllFeedbacks(searchKeyword, status);
  const total = allFeedbacks.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const feedbacks = allFeedbacks.slice(startIndex, startIndex + pageSize);
  
  return {
    feedbacks,
    total,
    totalPages,
    currentPage: page,
  };
}

export function getFeedbackById(id: string): Feedback | undefined {
  return readFeedbacks().find(f => f.id === id);
}

export function createFeedback(data: CreateFeedbackRequest): Feedback {
  const feedbacks = readFeedbacks();
  const now = new Date().toISOString();
  const newFeedback: Feedback = {
    id: uuidv4(),
    title: data.title,
    content: data.content,
    category: data.category,
    email: data.email,
    phone: data.phone,
    screenshots: data.screenshots,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  feedbacks.push(newFeedback);
  writeFeedbacks(feedbacks);
  return newFeedback;
}

export function updateFeedbackStatus(id: string, status: FeedbackStatus): Feedback | null {
  const feedbacks = readFeedbacks();
  const index = feedbacks.findIndex(f => f.id === id);
  if (index === -1) {
    return null;
  }
  feedbacks[index] = {
    ...feedbacks[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  writeFeedbacks(feedbacks);
  return feedbacks[index];
}
