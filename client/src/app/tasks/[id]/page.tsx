"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Task, TaskDetailProps } from "../../interfaces/Task.interface";

const TaskDetail: React.FC<TaskDetailProps> = () => {
  const router = useRouter();
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const currentTask = tasks.find((task) => task.id === params.id) || null;
    setTask(currentTask);
  }, [params.id]);

  const handleDelete = () => {
    const tasks: Task[] = JSON.parse(
      localStorage.getItem("tasks") || "[]"
    ).filter((task: Task) => task.id !== params.id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    router.push("/tasks");
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
      <p>{task.description}</p>
      <button
        onClick={handleDelete}
        className="mt-4 bg-red-600 text-white p-2 rounded"
      >
        Delete Task
      </button>
    </div>
  );
};

export default TaskDetail;
