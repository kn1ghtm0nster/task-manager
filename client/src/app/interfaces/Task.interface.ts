export interface Task {
  id?: string;
  title: string;
  description: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDetailProps {
  params: {
    id: string;
  };
}
