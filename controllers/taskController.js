const prisma = require("../prismaClient/prismaClient");

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
      },
    });
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "task created successfully",
      data: [],
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: error.message,
      data: [],
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 

    const offset = (page - 1) * limit;

    const tasks = await prisma.task.findMany({
      skip: offset,
      take: limit,
    });

    const totalTasks = await prisma.task.count();

    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "tasks fetched successfully",
      data: tasks,
      pagination: {
        totalTasks,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: error.message,
      data: [],
    });
  }
};


exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });
    if (!task) {
      return res.status(400).send({
        status: "failed",
        statusCode: 400,
        message: "task not found",
        data: [],
      });
    }
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "task fetched successfully",
      data: task,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: error.message,
      data: [],
    });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });
    if (!task) {
      return res.status(400).send({
        status: "failed",
        statusCode: 400,
        message: "task not found to update",
        data: [],
      });
    }
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, status },
    });
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "task updated successfully",
      data: [],
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: error.message,
      data: [],
    });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });
    if (!task) {
      return res.status(400).send({
        status: "failed",
        statusCode: 400,
        message: "task not found to delete",
        data: [],
      });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "task deleted successfully",
      data: task,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: error.message,
      data: [],
    });
  }
};
