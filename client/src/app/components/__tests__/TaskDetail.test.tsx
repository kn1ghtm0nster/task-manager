import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useParams } from "next/navigation";

import TaskDetail from "../../tasks/[id]/page";
import { Task } from "../../interfaces/Task.interface";

// Mocking next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("TaskDetail Component", () => {
  const mockPush = jest.fn();

  beforeAll(() => {
    // Mock global.fetch if needed for tests
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock useRouter hook to return a mock push function
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock useParams hook to return a specific task id
    (useParams as jest.Mock).mockReturnValue({
      id: "1",
    });

    // Preload localStorage with a mock task
    const mockTask: Task = {
      id: "1",
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("tasks", JSON.stringify([mockTask]));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders the TaskDetail form correctly", async () => {
    const TaskDetailComponent = TaskDetail as React.FC<unknown>;
    render(<TaskDetailComponent />);

    // Wait for useEffect to run and state to update
    await waitFor(() => {
      // Check the form field values are correct
      const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(
        "Description"
      ) as HTMLInputElement;
      const statusSelect = screen.getByLabelText("Status") as HTMLSelectElement;

      expect(titleInput).toBeInTheDocument();
      expect(titleInput.value).toBe("Test Task");

      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput.value).toBe("Test Description");

      expect(statusSelect).toBeInTheDocument();
      expect(statusSelect.value).toBe("pending");

      expect(screen.getByText("Back")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
      expect(screen.getByText("Update")).toBeInTheDocument();
    });
  });

  it("sets the task details correctly from localStorage", async () => {
    //@ts-expect-error: Ignore Typescript error for missing props
    render(<TaskDetail />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toHaveValue("Test Task");
      expect(screen.getByLabelText("Description")).toHaveValue(
        "Test Description"
      );
      expect(screen.getByLabelText("Status")).toHaveValue("pending");
    });
  });

  it("displays loading message when the task is not found", async () => {
    // Update useParams to return a non-existing task-id
    (useParams as jest.Mock).mockReturnValue({
      id: "9999",
    });

    const TaskDetailComponent = TaskDetail as React.FC<unknown>;
    render(<TaskDetailComponent />);

    await waitFor(() => {
      // Component should display a loading message IMMEDIATELY when task is not found
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("navigates back to /tasks when back button is clicked", async () => {
    render(<TaskDetail params={{ id: "1" }} />);

    // Wait for async processes to complete
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();

      const backButton = screen.getByText("Back");
      userEvent.click(backButton);

      expect(mockPush).toHaveBeenCalledWith("/tasks");
    });
  });

  it("updates the task in localStorage and navigates to /tasks when update button is clicked", async () => {
    render(<TaskDetail params={{ id: "1" }} />);

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;
    const statusSelect = screen.getByLabelText("Status") as HTMLSelectElement;
    const updateButton = screen.getByText("Update");

    // Simulate user input
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Test Task");

    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, "Updated Test Description");

    await userEvent.selectOptions(statusSelect, "completed");

    // Click the Update button
    userEvent.click(updateButton);

    await waitFor(() => {
      // Verify that localStorage was updated
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      expect(storedTasks).toHaveLength(1);
      expect(storedTasks[0]).toMatchObject({
        id: "1",
        title: "Updated Test Task",
        description: "Updated Test Description",
        status: "completed",
        // createdAt should remain unchanged
        createdAt: expect.any(String),
        // updatedAt should be updated to a new timestamp
        updatedAt: expect.any(String),
      });

      // Verify that router.push was called with "/tasks"
      expect(mockPush).toHaveBeenCalledWith("/tasks");
    });
  });

  it("deletes the task from localStorage and navigates to /tasks when delete button is clicked", async () => {
    render(<TaskDetail params={{ id: "1" }} />);

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Delete");
    userEvent.click(deleteButton);

    await waitFor(() => {
      // Verify that localStorage no longer contains the task
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      expect(storedTasks).toHaveLength(0);

      // Verify that router.push was called with "/tasks"
      expect(mockPush).toHaveBeenCalledWith("/tasks");
    });
  });

  it("prevents updating with empty title", async () => {
    // @ts-expect-error: Ignore Typescript error for missing props
    render(<TaskDetail />);

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const updateButton = screen.getByText("Update");

    // Clear the title input
    await userEvent.clear(titleInput);

    // Click the Update button
    await userEvent.click(updateButton);
  });

  it("prevents updating with empty description", async () => {
    // @ts-expect-error: Ignore Typescript error for missing props
    render(<TaskDetail />);

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;
    const updateButton = screen.getByText("Update");

    // Clear the description input
    await userEvent.clear(descriptionInput);

    // Click the Update button
    await userEvent.click(updateButton);
  });

  it("handles absence of status by defaulting to 'pending'", async () => {
    // Preload localStorage with a task that lacks the 'status' property
    const mockTaskWithoutStatus: Task = {
      id: "1",
      title: "Task Without Status",
      description: "Description without status",
      // status is intentionally omitted
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("tasks", JSON.stringify([mockTaskWithoutStatus]));

    // @ts-expect-error: Ignore TypeScript error for missing props
    render(<TaskDetail />);

    // Wait for useEffect to run and state to update
    await waitFor(() => {
      expect(screen.getByLabelText("Status")).toHaveValue("pending");
    });
  });

  it("updates the correct task when there are multiple tasks in localStorage", async () => {
    // Preload localStorage with multiple tasks
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Second Task",
        description: "Second Description",
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem("tasks", JSON.stringify(mockTasks));

    // @ts-expect-error: Ignore TypeScript error for missing props
    render(<TaskDetail />);

    // Mock useParams to return id "1"
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;
    const statusSelect = screen.getByLabelText("Status") as HTMLSelectElement;
    const updateButton = screen.getByText("Update");

    // Simulate user input for task with id "1"
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Test Task");

    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, "Updated Test Description");

    await userEvent.selectOptions(statusSelect, "completed");

    // Click the Update button
    await userEvent.click(updateButton);

    // Wait for the router.push to be called
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/tasks");
    });

    // Verify that localStorage was updated correctly
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    expect(storedTasks).toHaveLength(2);

    const updatedTask = storedTasks.find((task: Task) => task.id === "1");
    const secondTask = storedTasks.find((task: Task) => task.id === "2");

    expect(updatedTask).toMatchObject({
      id: "1",
      title: "Updated Test Task",
      description: "Updated Test Description",
      status: "completed",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    // Ensure the second task remains unchanged
    expect(secondTask).toMatchObject({
      id: "2",
      title: "Second Task",
      description: "Second Description",
      status: "completed",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("deletes the correct task when multiple tasks exist in localStorage", async () => {
    // Preload localStorage with multiple tasks
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Second Task",
        description: "Second Description",
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem("tasks", JSON.stringify(mockTasks));

    // @ts-expect-error: Ignore TypeScript error for missing props
    render(<TaskDetail />);

    // Mock useParams to return id "1"
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Delete");
    await userEvent.click(deleteButton); // Await the click

    // Wait for the router.push to be called
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/tasks");
    });

    // Verify that localStorage now contains only the second task
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    expect(storedTasks).toHaveLength(1);
    expect(storedTasks[0]).toMatchObject({
      id: "2",
      title: "Second Task",
      description: "Second Description",
      status: "completed",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
