"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Task, TaskDetailProps } from "../../interfaces/Task.interface";

const TaskDetail: React.FC<TaskDetailProps> = () => {
  const router = useRouter();
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");

  useEffect(() => {
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const currentTask = tasks.find((task) => task.id === params.id) || null;
    setTask(currentTask);

    // Populate form fields when a task is found
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setStatus(currentTask.status || "pending");
    }
  }, [params.id]);

  const handleBack = () => {
    router.push("/tasks");
  };

  const handleUpdate = () => {
    if (task) {
      const updatedTask: Task = {
        ...task,
        title,
        description,
        status,
        updatedAt: new Date(),
      };

      // Update the task in localstorage
      const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
      const updatedTasks: Task[] = tasks.map((task) =>
        task.id === params.id ? updatedTask : task
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      router.push("/tasks");
    }
  };

  const handleDelete = () => {
    const tasks: Task[] = JSON.parse(
      localStorage.getItem("tasks") || "[]"
    ).filter((task: Task) => task.id !== params.id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    router.push("/tasks");
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </form>
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          Back
        </button>
        <div className="space-x-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
