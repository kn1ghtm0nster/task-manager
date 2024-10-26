export interface Task {
  id?: string;
  title: string;
  description: string;
  status?: "pending" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDetailProps {
  params: {
    id: string;
  };
}
