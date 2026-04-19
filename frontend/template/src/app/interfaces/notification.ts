export interface Notification {
  id: number;
  task_id: string;
  title: string;
  message: string;
  status: 'unread' | 'read';
  sender_name?: string | null;
  recipient_role?: string | null;
  createdAt: string;
  updatedAt: string;
}
