import React from "react";
import { render, screen } from "@testing-library/react";
import TaskList from "../../tasks/page";
import { Task } from "../../interfaces/Task.interface";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("TaskList Component", () => {
  const mockTask: Task = {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTasks: Task[] = [mockTask];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  it("renders an empty page if there are no tasks", () => {
    render(<TaskList />);
    expect(screen.getByText("Your Tasks")).toBeInTheDocument();
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
  });

  it("handles corrupted localStorage data gracefully", () => {
    localStorage.setItem("tasks", "corrupted data");
    render(<TaskList />);
    expect(screen.getByText("Your Tasks")).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith(
      "Failed to parse tasks from localStorage:",
      expect.any(SyntaxError)
    );
  });

  it("syncs tasks with the API and logs errors for failed sync", async () => {
    // Mock fetch to resolve with { ok: false }
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    // Set localStorage with a single task
    localStorage.setItem("tasks", JSON.stringify(mockTasks));

    render(<TaskList />);

    // Wait for the task to appear in the DOM
    await screen.findByText("Task 1");

    // Expect console.error to have been called once with the specific message
    expect(console.error).toHaveBeenCalledWith(
      "Failed to sync task with id: 1"
    );

    // Ensure fetch was called once
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockTask),
    });
  });

  it("handles network errors during sync", async () => {
    // Mock fetch to reject with a network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    // Set localStorage with a single task
    localStorage.setItem("tasks", JSON.stringify(mockTasks));

    render(<TaskList />);

    // Wait for the task to appear in the DOM
    await screen.findByText("Task 1");

    // Expect console.error to have been called once with the specific message
    expect(console.error).toHaveBeenCalledWith(
      "Error syncing task:",
      expect.any(Error)
    );

    // Ensure fetch was called once
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockTask),
    });
  });
});
