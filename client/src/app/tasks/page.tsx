"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Task } from "../interfaces/Task.interface";
import TaskCard from "../components/TaskCard";

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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md flex flex-col">
      <h2 className="text-center text-2xl font-bold mb-4">Your Tasks</h2>
      <ul className="space-y-4 flex-grow">
        {tasks.map((task: Task) => (
          <li key={task.id}>
            <TaskCard task={task} />
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          href="/tasks/new"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors inline-block"
        >
          Add New Task
        </Link>
      </div>
    </div>
  );
};

export default TaskList;
