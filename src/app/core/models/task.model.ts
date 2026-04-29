export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  createdDate: string;
}