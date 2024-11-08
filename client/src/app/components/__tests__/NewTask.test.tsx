// src/app/components/__tests__/NewTask.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Task } from "../../interfaces/Task.interface";
import { useRouter } from "next/navigation";

// Mocking useRouter from next/navigation before importing the component
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mocking global.fetch before importing the component
beforeAll(() => {
  global.fetch = jest.fn();
});

import NewTask from "../../tasks/new/page"; // Import after mocking

describe("NewTask Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mocking useRouter to return a mock push function
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mocking console.error to prevent actual error logs during tests
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders the NewTask form correctly", () => {
    render(<NewTask />);
    expect(screen.getByText("New Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task Description")).toBeInTheDocument();
    expect(screen.getByText("Save Task")).toBeInTheDocument();
  });

  it("allows users to input title and description", () => {
    render(<NewTask />);

    const titleInput = screen.getByPlaceholderText(
      "Task Title"
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      "Task Description"
    ) as HTMLTextAreaElement;

    fireEvent.change(titleInput, { target: { value: "New Task Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "New Task Description" },
    });

    expect(titleInput.value).toBe("New Task Title");
    expect(descriptionInput.value).toBe("New Task Description");
  });

  it("successfully saves a new task and redirects", async () => {
    const mockTask: Task = {
      id: "1",
      title: "New Task",
      description: "New Description",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Mocking fetch to resolve with a successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockTask,
        createdAt: mockTask.createdAt,
        updatedAt: mockTask.updatedAt,
      }),
    });

    render(<NewTask />);

    const titleInput = screen.getByPlaceholderText(
      "Task Title"
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      "Task Description"
    ) as HTMLTextAreaElement;
    const saveButton = screen.getByText("Save Task");

    // Simulate user input
    fireEvent.change(titleInput, { target: { value: mockTask.title } });
    fireEvent.change(descriptionInput, {
      target: { value: mockTask.description },
    });

    // Simulate clicking the save button
    fireEvent.click(saveButton);

    // Wait for async operations to complete
    await waitFor(() => {
      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toBe("/api/tasks");
      expect(options.method).toBe("POST");
      expect(options.headers).toEqual({
        "Content-Type": "application/json",
      });

      const body = JSON.parse(options.body);
      expect(body.title).toBe(mockTask.title);
      expect(body.description).toBe(mockTask.description);
      expect(body.status).toBe("pending");
      expect(new Date(body.createdAt)).toBeInstanceOf(Date);
      expect(new Date(body.updatedAt)).toBeInstanceOf(Date);

      // Verify localStorage was updated
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      expect(storedTasks).toEqual([
        {
          ...mockTask,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);

      // Verify redirection
      expect(mockPush).toHaveBeenCalledWith("/tasks");
    });
  });

  it("logs an error when the API fails to save the task", async () => {
    // Mocking fetch to resolve with a failed response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<NewTask />);

    const titleInput = screen.getByPlaceholderText(
      "Task Title"
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      "Task Description"
    ) as HTMLTextAreaElement;
    const saveButton = screen.getByText("Save Task");

    // Simulate user input
    fireEvent.change(titleInput, { target: { value: "Fail Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Fail Description" },
    });

    // Simulate clicking the save button
    fireEvent.click(saveButton);

    // Wait for async operations to complete
    await waitFor(() => {
      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toBe("/api/tasks");
      expect(options.method).toBe("POST");
      expect(options.headers).toEqual({
        "Content-Type": "application/json",
      });

      const body = JSON.parse(options.body);
      expect(body.title).toBe("Fail Task");
      expect(body.description).toBe("Fail Description");
      expect(body.status).toBe("pending");
      expect(new Date(body.createdAt)).toBeInstanceOf(Date);
      expect(new Date(body.updatedAt)).toBeInstanceOf(Date);

      // Verify console.error was called
      expect(console.error).toHaveBeenCalledWith("Failed to save task");
    });

    // Ensure no redirection occurred
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("logs an error when there is a network error during save", async () => {
    // Mocking fetch to reject with a network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    render(<NewTask />);

    const titleInput = screen.getByPlaceholderText(
      "Task Title"
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      "Task Description"
    ) as HTMLTextAreaElement;
    const saveButton = screen.getByText("Save Task");

    // Simulate user input
    fireEvent.change(titleInput, { target: { value: "Network Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Network Description" },
    });

    // Simulate clicking the save button
    fireEvent.click(saveButton);

    // Wait for async operations to complete
    await waitFor(() => {
      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toBe("/api/tasks");
      expect(options.method).toBe("POST");
      expect(options.headers).toEqual({
        "Content-Type": "application/json",
      });

      const body = JSON.parse(options.body);
      expect(body.title).toBe("Network Task");
      expect(body.description).toBe("Network Description");
      expect(body.status).toBe("pending");
      expect(new Date(body.createdAt)).toBeInstanceOf(Date);
      expect(new Date(body.updatedAt)).toBeInstanceOf(Date);

      // Verify console.error was called with the error
      expect(console.error).toHaveBeenCalledWith(
        "API Error Details",
        expect.any(Error)
      );
    });

    // Ensure no redirection occurred
    expect(mockPush).not.toHaveBeenCalled();
  });
});
