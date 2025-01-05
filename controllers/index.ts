import { Request, Response } from "express";
import pool from "../db";

export const addTasks = async (req: Request, res: Response) => {
  const { title, description, tag, column_id, tag_bg, tag_color } = req.body;
  if (!title || !description || !tag) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, tag, column_id, position, tag_bg, tag_color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, description, tag, column_id, 0, tag_bg, tag_color]
    );

    const createdTask = result.rows[0];
    await pool.query(
      "INSERT INTO task_history (task_id, action, column_id, position,title) VALUES ($1, $2, $3, $4, $5)",
      [
        createdTask.id,
        "created",
        createdTask.column_id,
        createdTask.position,
        createdTask.title,
      ]
    );

    res.status(201).json({
      message: "Task successfully added!",
      task: createdTask,
    });
  } catch (error) {
    console.error("Error adding task:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const { column_id } = req.query;
  let query = "SELECT * FROM tasks";
  const values: string[] = [];

  if (column_id) {
    query += " WHERE column_id = $1";
    values.push(column_id as string);
  }

  query += " ORDER BY position ASC";

  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const updateTasks = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { column_id, position } = req.body;
  try {
    const taskResult = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    const task = taskResult.rows[0];
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await pool.query(
      "INSERT INTO task_history (task_id, action, column_id, position, title) VALUES ($1, $2, $3, $4, $5)",
      [task.id, "updated", column_id, position, task.title]
    );

    await pool.query(
      "UPDATE tasks SET column_id = $1, position = $2 WHERE id = $3",
      [column_id, position, id]
    );
    res.send("Task Updated");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const deleteTasks = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const taskResult = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    const task = taskResult.rows[0];
    console.log(task);

    await pool.query(
      "INSERT INTO task_history (task_id, action, column_id, position, title, description, tag) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        task.id,
        "deleted",
        task.column_id,
        task.position,
        task.title,
        task.description,
        task.tag,
      ]
    );

    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

    res.send("Task Deleted and history updated.");
  } catch (error) {
    console.error("Error deleting task:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

export const getAllTaskHistory = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM task_history ORDER BY created_at DESC"
    );

    res.status(200).json({
      message: "Task history fetched successfully!",
      history: result.rows,
    });
  } catch (error) {
    console.error("Error fetching task history:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};
