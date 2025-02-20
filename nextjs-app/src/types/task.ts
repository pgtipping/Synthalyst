export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  tags?: string[];
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  reminderAt?: string;
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: string;
  };
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  metadata?: Record<string, unknown>;
}
