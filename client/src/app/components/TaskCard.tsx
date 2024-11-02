"use client";
import React from "react";
import { TaskCardProps } from "../interfaces/TaskCard.interface";

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const isPending = task.status === "pending"; // check if task is pending

  return (
    <div className="max-w-md mx-auto p-4 mb-4 bg-white dark:bg-gray-700 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPending
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {isPending ? "Pending" : "Completed"}
        </span>
      </div>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard; // Exporting the TaskCard component
