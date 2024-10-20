/**
 * Task model
 *
 * Defines a basic Task interface
 *
 * @interface Task
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  createdAt: Date;
  updatedAt: Date;
}
