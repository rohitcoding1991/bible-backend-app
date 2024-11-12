const request = require("supertest");
const express = require("express");
const taskController = require("../controllers/taskController");
const prisma = require("../prismaClient/prismaClient");

jest.mock("../prismaClient/prismaClient", () => ({
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.post("/task", taskController.createTask);
app.get("/tasks", taskController.getTasks);
app.get("/tasks/:id", taskController.getTaskById);
app.put("/tasks/:id", taskController.updateTask);
app.delete("/tasks/:id", taskController.deleteTask);

describe("Task Controller", () => {
  describe("POST /task", () => {
    it("should create a new task", async () => {
      const mockTask = { id: 1, title: "Test Task", description: "Test description" };
      prisma.task.create.mockResolvedValue(mockTask);

      const response = await request(app)
        .post("/task")
        .send({ title: "Test Task", description: "Test description" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { title: "Test Task", description: "Test description" },
      });
    });
  });

  describe("GET /tasks", () => {
    it("should fetch tasks with pagination", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", description: "Description 1" },
        { id: 2, title: "Task 2", description: "Description 2" },
      ];
      prisma.task.findMany.mockResolvedValue(mockTasks);
      prisma.task.count.mockResolvedValue(2);

      const response = await request(app).get("/tasks?page=1&limit=10");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toEqual(mockTasks);
      expect(prisma.task.findMany).toHaveBeenCalled();
    });
  });

  describe("GET /tasks/:id", () => {
    it("should fetch a task by ID", async () => {
      const mockTask = { id: 1, title: "Task 1", description: "Description 1" };
      prisma.task.findUnique.mockResolvedValue(mockTask);

      const response = await request(app).get("/tasks/1");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toEqual(mockTask);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("should return 400 if task not found", async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      const response = await request(app).get("/tasks/999");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("task not found");
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update a task by ID", async () => {
      const mockTask = { id: 1, title: "Task 1", description: "Description 1" };
      prisma.task.findUnique.mockResolvedValue(mockTask);
      prisma.task.update.mockResolvedValue({ ...mockTask, title: "Updated Task" });

      const response = await request(app)
        .put("/tasks/1")
        .send({ title: "Updated Task", description: "Updated description" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("task updated successfully");
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: "Updated Task", description: "Updated description" },
      });
    });

    it("should return 400 if task not found to update", async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put("/tasks/999")
        .send({ title: "Updated Task", description: "Updated description" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("task not found to update");
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task by ID", async () => {
      const mockTask = { id: 1, title: "Task 1", description: "Description 1" };
      prisma.task.findUnique.mockResolvedValue(mockTask);
      prisma.task.delete.mockResolvedValue(mockTask);

      const response = await request(app).delete("/tasks/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("task deleted successfully");
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("should return 400 if task not found to delete", async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      const response = await request(app).delete("/tasks/999");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("task not found to delete");
    });
  });
});
