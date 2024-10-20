// LIBRARY IMPORTS - NOT HARD
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// LOCAL IMPORTS - ALSO NOT HARD
import * as taskService from "../services/taskService";
import { Task } from "../models/task";

// This is where the route logic begins. NOT HARD

// TODO: Implement graceful error handling

/**
 * Get ALL tasks and send them back to the user. NOT HARD
 *
 * @param {Request} req - The request object. NOT used here
 * @param {Response} res - The response object used to send ALL tasks
 */
export const getAllTasks = (req: Request, res: Response): void => {
  const tasks = taskService.getAllTasks();
  res.json(tasks);
};

/**
 *
 * Get a task by its ID and send it back to the user.
 * If the task is NOT found, respond with a 404 status code.
 *
 * @param {Request} req - The request object which contains the task ID
 * @param {Response} res - The reponse object, use to send back the task or a 404 status code
 */
export const getTaskById = (req: Request, res: Response): any => {
  const task = taskService.getTaskById(req.params.id); // URL param will contain the task id. DON'T FORGET THIS
  if (!task) {
    // if task not found, respond with 404. NOT HARD. THIS IS REST DESIGN PLEASE.
    return res.status(404).json({ message: "TASK NOT FOUND YO" });
  }
  res.json(task);
};

/**
 * Create a new task and send it back to the user.
 *
 * @param {Request} req - The request object which contains the new task data
 * @param {Response} res - This is the response object used to send the new task back to the user
 */
export const createTask = (req: Request, res: Response): any => {
  const { title, description, status } = req.body;
  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    status: status || "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const task = taskService.createTask(newTask);
  res.status(201).json(task);
};

/**
 * Update a task by its given ID and send it back to the user after upadted.
 *
 * IF the task is not found, respond with a 404 status code.
 *
 * @param {Request} req - The request object which contains the task ID and the updated task data
 *
 * @param {Response} res - The reponse object used to send back the updated task or a 404 status code
 */
export const updateTask = (req: Request, res: Response): any => {
  const updatedTask = taskService.updatedTask(req.params.id, req.body); // URL param will contain the task id. DON'T FORGET THIS

  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(updatedTask);
};

/**
 * Delete a task by its given ID. That's it. That's the route.
 *
 * @param {Request} req - The request object which contains the task ID.
 *
 * @param {Response} res - The response object that will send a 204 status code if the task is deleted, or a 404 status code if the task is not found.
 */
export const deleteTask = (req: Request, res: Response): any => {
  const isDeleted = taskService.deleteTask(req.params.id); // URL param will contain the task id. DON'T FORGET THIS

  if (!isDeleted) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(204).send();
};
