import React from "react";
import { render, screen } from "@testing-library/react";
import TaskList from "../../tasks/page";
import { Task } from "../../interfaces/Task.interface";

describe("TaskList Component", () => {
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeAll(() => {
    localStorage.setItem("tasks", JSON.stringify(mockTasks));
  });

  it("renders the list of tasks from localStorage", () => {
    render(<TaskList />);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });
});
