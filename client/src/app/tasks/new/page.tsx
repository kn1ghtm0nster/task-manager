"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Task } from "../../interfaces/Task.interface";

const NewTask: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSave = async () => {
    const newTask: Omit<Task, "id"> = {
      title,
      description,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Send new task to the API to save it
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const savedTask: Task = await response.json();

        // Update localStorage with the new task from the API
        const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
        tasks.push(savedTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Redirect to the tasks list page
        router.push("/tasks");
      } else {
        console.error("Failed to save task");
      }
    } catch (error) {
      console.error("API Error Details", error);
    }
  };

  // TODO: form validation
  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">New Task</h2>
      <input
        className="border dark:border-gray-600 p-3 w-full mb-4 bg-gray-50 dark:bg-gray-700 text-black dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border dark:border-gray-600 p-3 w-full mb-4 bg-gray-50 dark:bg-gray-700 text-black dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white p-3 w-full rounded"
      >
        Save Task
      </button>
    </div>
  );
};

export default NewTask;
