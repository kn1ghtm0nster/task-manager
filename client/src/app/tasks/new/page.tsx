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
      createdAt: new Date(),
      updatedAt: new Date(),
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white p-2 rounded"
      >
        Save Task
      </button>
    </div>
  );
};

export default NewTask;
