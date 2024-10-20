// LIBRARY IMPORTS - NOT HARD
import { Router } from "express";

// LOCAL IMPORTS - ALSO NOT HARD
import * as taskController from "../controllers/taskController";

const router = Router();

// This is where we connect the "controller" to the actual routes.

router.get("/tasks", taskController.getAllTasks);
router.post("/tasks", taskController.createTask);
router.get("/tasks/:id", taskController.getTaskById);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

export default router;
