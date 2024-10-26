"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Task } from "../interfaces/Task.interface";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Utility function to safely get tasks from localStorage
  const getSavedTasks = (): Task[] => {
    const savedTasksString = localStorage.getItem("tasks");
    return savedTasksString ? JSON.parse(savedTasksString) : [];
  };

  useEffect(() => {
    const savedTasks = getSavedTasks();
    setTasks(savedTasks);

    // Sync each task in localStorage to the API
    savedTasks.forEach(async (task) => {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        if (!response.ok) {
          console.error(`Failed to sync task with id: ${task.id}`);
        }
      } catch (error) {
        console.error("Error syncing task:", error);
      }
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="text-center text-2xl font-bold mb-4">Your Tasks</h2>
      <ul>
        {tasks.map((task: Task) => (
          <li key={task.id} className="mb-2">
            <Link
              href={`/tasks/${task.id}`}
              className="text-blue-600 hover:underline"
            >
              {task.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/tasks/new" className="text-green-600 hover:underline">
        New Task
      </Link>
    </div>
  );
};

export default TaskList;
