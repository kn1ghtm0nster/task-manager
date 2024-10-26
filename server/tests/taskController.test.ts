// region Imports
import request from "supertest";
import express from "express";

import taskRoutes from "../src/routes/taskRoutes";
import { errorHandler } from "../src/utils/errorHandler";

// endregion Imports

// region Setup

const app = express();
app.use(express.json());
app.use("/api", taskRoutes);
app.use(errorHandler);

// endregion Setup

// region Unit Tests

let createdTaskId: string; // Variable to store the ID of the created task

beforeEach(async () => {
  const response = await request(app).post("/api/tasks").send({
    title: "Initial Task",
    description: "This is an initial task",
    status: "pending",
    createdDate: new Date(),
    updatedDate: new Date(),
  });

  createdTaskId = response.body.id; // Store the ID of the created task for later use
});

describe("Task Controller", () => {
  describe("getTaskById", () => {
    it("returns all available tasks", async () => {
      const response = await request(app).get(`/api/tasks/${createdTaskId}`);
      expect(response.status).toBe(200);
    });

    it("returns 404 if task not found", async () => {
      const response = await request(app).get(`/api/tasks/invalid-id`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Task Not Found");
    });
  });

  describe("createTask", () => {
    it("creates a new task and returns it with 201 status code", async () => {
      const newTask = {
        title: "New Test Task",
        description: "This is a new test task",
        status: "pending",
      };

      const response = await request(app).post("/api/tasks").send(newTask);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
      });
    });
  });

  describe("updateTask", () => {
    it("updates an existing task as expected", async () => {
      const updatedTask = {
        title: "Updated Test Task",
        status: "completed",
      };

      const response = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: updatedTask.title,
        status: updatedTask.status,
      });
    });

    it("returns 404 if task to update does not exist", async () => {
      const response = await request(app)
        .put(`/api/tasks/invalid-id`)
        .send({ status: "completed" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Task Not Found");
    });
  });

  describe("deleteTask", () => {
    it("deletes an existing task and returns 204 status code", async () => {
      const response = await request(app).delete(`/api/tasks/${createdTaskId}`);

      expect(response.status).toBe(204);
    });

    it("returns 404 if task to delete does not exist", async () => {
      const response = await request(app).delete(`/api/tasks/invalid-id`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Task Not Found");
    });
  });
});

// endregion Unit Tests
