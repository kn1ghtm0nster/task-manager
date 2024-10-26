// region Imports
import request from "supertest";
import express from "express";
import taskRoutes from "../src/routes/taskRoutes";
import { errorHandler } from "../src/utils/errorHandler";
import { title } from "process";

// endregion Imports

// region Setup

const app = express();
app.use(express.json());
app.use("/api", taskRoutes);
app.use(errorHandler);

// endregion Setup

// region Integration Tests

let createdTaskId: string; // Variable to store the ID of the created task

let taskArray = [
  {
    id: "1",
    title: "Test Task 1",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// clear taskArray before each test
beforeEach(async () => {
  const response = await request(app).post("/api/tasks").send({
    title: "Test Task 1",
    description: "This is a test task",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  createdTaskId = response.body.id; // Store the ID of the created task
});

describe("GET /api/tasks", () => {
  it("returns all tasks with 200 status code", async () => {
    const response = await request(app).get("/api/tasks");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(taskArray.length);
    expect(response.body[0]).toMatchObject({
      title: "Test Task 1",
      status: "pending",
    });
  });
});

describe("POST /api/tasks", () => {
  it("creates a new task and returns it with 201 status code", async () => {
    const newTask = {
      title: "New Task",
      description: "This is a new task",
      status: "pending",
    };

    const response = await request(app).post("/api/tasks").send(newTask);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newTask);
  });
});

describe("GET /api/tasks/:id", () => {
  it("returns a task with the provided ID as expected", async () => {
    const response = await request(app).get(`/api/tasks/${createdTaskId}`);
    expect(response.status).toBe(200);
  });

  it("returns 404 if the task is not found", async () => {
    const response = await request(app).get("/api/tasks/invalid-id");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task Not Found");
    expect(response.body).toMatchObject({});
  });
});

describe("PUT /api/tasks/:id", () => {
  it("updates a task successfully and returns 200 status code", async () => {
    const updatedTask = {
      status: "completed",
    };
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send(updatedTask);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("completed");
  });

  it("returns 404 if the task is not found", async () => {
    const response = await request(app).get("/api/tasks/invalid-id");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task Not Found");
    expect(response.body).toMatchObject({});
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("deletes a task successfully and returns 204 status code", async () => {
    const response = await request(app).delete(`/api/tasks/${createdTaskId}`);
    expect(response.status).toBe(204);
  });

  it("returns 404 if the task is not found", async () => {
    const response = await request(app).delete("/api/tasks/invalid-id");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task Not Found");
    expect(response.body).toMatchObject({});
  });
});

// endregion Integration Tests
