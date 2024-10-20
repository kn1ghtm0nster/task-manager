import { Task } from "../models/task";

const tasks: Task[] = []; // Simulate a db with an in-memory array

/**
 *
 * Get all tasks
 * @returns {Task[]} An array of tasks
 */
export const getAllTasks = (): Task[] => {
  return tasks;
};

/**
 *
 * Get a task by id
 * @param {string} id - The ID of the task
 * @returns {Task | undefined } The task with the given ID, or undefined if not found
 */
export const getTaskById = (id: string): Task | undefined => {
  return tasks.find((task) => task.id === id);
};

/**
 * Create a new task - Not hard
 *
 * @param {Task} task - The task to create.
 * @returns {Task} The created task. Again, not hard.
 */
export const createTask = (task: Task): Task => {
  tasks.push(task);
  return task;
};

/**
 *
 * Update a task by its given ID - NOT HARD
 *
 * @param {string} id - The ID of the task to update
 * @param {Partial<Task>} updatedData - New data for the task id
 * @returns {Task | null} The updated task, or null if not found.
 */
export const updatedTask = (
  id: string,
  updatedData: Partial<Task>
): Task | null => {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) return null;

  const updatedTask = {
    ...tasks[taskIndex],
    ...updatedData,
    updatedAt: new Date(),
  };

  tasks[taskIndex] = updatedTask;

  return updatedTask;
};

/**
 * Delete a task by its given ID - NOT HARD
 *
 * @param {string} id - The ID of the taks to delete.
 * @returns {boolean} True if the task was deleted, false if not found. MAGIC
 */
export const deleteTask = (id: string): boolean => {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) return false;

  tasks.splice(taskIndex, 1);

  return true;
};
