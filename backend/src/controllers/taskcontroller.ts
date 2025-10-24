import type { Request, Response } from "express";
import {
  Task,
  SpeakingTask,
  ListeningTask,
  ReadingTask,
  WritingTask,
  setupAssociations,
} from "../models/index.js";

// Initialize associations
setupAssociations();

export default {
  // Crear una tarea con su subtipo
  async createTask(req: Request, res: Response) {
    try {
      const { task_type, task_id, name_of_item_writer, team, date } = req.body;

      if (task_id) {
        const existingTask = await Task.findOne({ where: { task_id } });
        if (existingTask) {
          return res.status(400).json({ error: "task_id ya existe" });
        }
      }

      // Crear Task base
      const task = await Task.create({
        task_id,
        task_type,
        name_of_item_writer,
        team,
        date,
      });

      // Crear subtipo según task_type
      switch (task_type) {
        case "listening":
          await ListeningTask.create({ task_id: task_id, ...req.body });
          break;
        case "speaking":
          await SpeakingTask.create({ task_id: task_id, ...req.body });
          break;
        case "reading":
          await ReadingTask.create({ task_id: task_id, ...req.body });
          break;
        case "writing":
          await WritingTask.create({ task_id: task_id, ...req.body });
          break;
        default:
          return res.status(400).json({ error: "Tipo de tarea no válido" });
      }

      return res.status(201).json({ message: "Tarea creada", task });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error creando la tarea" });
    }
  },

  // Obtener todas las tareas con detalles
  async getAllTasks(_req: Request, res: Response) {
    try {
      const tasks = await Task.findAll({
        include: [
          { model: SpeakingTask, as: "speaking" },
          { model: ListeningTask, as: "listening" },
          { model: ReadingTask, as: "reading" },
          { model: WritingTask, as: "writing" },
        ],
      });
      return res.json(tasks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error obteniendo tareas" });
    }
  },

  // Obtener una tarea por ID
  async getTaskById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await Task.findOne({
        where: { task_id: id },
        include: [
          { model: SpeakingTask, as: "speaking" },
          { model: ListeningTask, as: "listening" },
          { model: ReadingTask, as: "reading" },
          { model: WritingTask, as: "writing" },
        ],
      });

      if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
      return res.json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error obteniendo la tarea" });
    }
  },

  async getTaskByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const task = await Task.findAll({
        where: { task_type: type },
        include: [
          { model: SpeakingTask, as: "speaking" },
          { model: ListeningTask, as: "listening" },
          { model: ReadingTask, as: "reading" },
          { model: WritingTask, as: "writing" },
        ],
      });

      if (!task) return res.status(404).json({ error: "Tareas no encontrada" });
      return res.json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error obteniendo las tareas" });
    }
  },


  async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { task_type, ...data } = req.body;

      const task = await Task.findByPk(id);
      if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

      await task.update({
        name_of_item_writer: data.name_of_item_writer,
        team: data.team,
        date: data.date,
      });

      switch (task_type) {
        case "speaking":
          await SpeakingTask.update(data, { where: { task_id: id } });
          break;
        case "listening":
          await ListeningTask.update(data, { where: { task_id: id } });
          break;
        case "reading":
          await ReadingTask.update(data, { where: { task_id: id } });
          break;
        case "writing":
          await WritingTask.update(data, { where: { task_id: id } });
          break;
      }

      return res.json({ message: "Tarea actualizada correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error actualizando tarea" });
    }
  },

  // Eliminar tarea
  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const task = await Task.findByPk(id);
      if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

      await SpeakingTask.destroy({ where: { task_id: id } });
      await ListeningTask.destroy({ where: { task_id: id } });
      await ReadingTask.destroy({ where: { task_id: id } });
      await WritingTask.destroy({ where: { task_id: id } });
      await task.destroy();

      return res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error eliminando tarea" });
    }
  },
};
