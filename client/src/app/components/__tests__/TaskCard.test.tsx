import React from "react";
import { render, screen } from "@testing-library/react";
import TaskCard from "../TaskCard";
import { Task } from "../../interfaces/Task.interface";

describe("TaskCard Component", () => {
  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "This is a test task",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    localStorage.clear(); // clearing localStorage before each test
  });

  it("renders ALL task information", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("This is a test task")).toBeInTheDocument();
  });

  it("shows the correct status color for a pending task", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("Pending")).toHaveClass(
      "px-3 py-1 rounded-full text-sm font-medium bg-yellow-200 text-yellow-800"
    );
  });
});
