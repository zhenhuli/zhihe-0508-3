export type FeedbackStatus = 'pending' | 'processing' | 'resolved';

export interface Feedback {
  id: string;
  title: string;
  content: string;
  category: string;
  email?: string;
  phone?: string;
  screenshots: string[];
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackRequest {
  title: string;
  content: string;
  category: string;
  email?: string;
  phone?: string;
  screenshots: string[];
}

export interface UpdateFeedbackStatusRequest {
  status: FeedbackStatus;
}
