import type { Request, Response } from "express";
import {
  Task,
  SpeakingTask,
  ListeningTask,
  ReadingTask,
  WritingTask,
  setupAssociations,
} from "../models/index.js";

// Initialize associat

setupAssociations();

const model = {
  listening: ListeningTask,
  reading: ReadingTask,
  speaking: SpeakingTask,
  writing: WritingTask,
};

type TaskType = keyof typeof model;

const getModelTask = (type: string) => {
  const normalizedType = type.toLowerCase().trim();
  return model[normalizedType as TaskType];
};

export default {
  // Crear una tarea con su subtipo
  async createTask(req: Request, res: Response) {
    try {
      const { task_type, task_id, name_of_item_writer, team, date, status } = req.body;

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
        status
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

  // Obtener tareas por tipo
  async getTaskByType(req: Request, res: Response) {
    const { type } = req.params;
    console.log(`🔍 Buscando tareas de tipo: ${type}`);

    try {
      // Validar que el tipo sea uno de los permitidos
      const validTypes = ["listening", "speaking", "reading", "writing"];
      const normalizedType = type.toLowerCase().trim();

      if (!validTypes.includes(normalizedType)) {
        console.error(`❌ Tipo de tarea no válido: ${type}`);
        return res.status(400).json({
          error: "Tipo de tarea no válido",
          message: `Los tipos válidos son: ${validTypes.join(", ")}`,
          receivedType: type,
        });
      }

      // Verificar si el modelo Task está disponible
      if (!Task) {
        console.error("❌ Error: El modelo Task no está disponible");
        return res.status(500).json({
          error: "Error interno del servidor",
          message: "Error al cargar los modelos de la base de datos",
        });
      }

      // Obtener el modelo correspondiente
      const taskModel = getModelTask(normalizedType as TaskType);
      if (!taskModel) {
        console.error(
          `❌ No se pudo encontrar el modelo para: ${normalizedType}`
        );
        return res.status(500).json({
          error: "Error interno del servidor",
          message: `No se pudo cargar el modelo para el tipo: ${normalizedType}`,
        });
      }

      // Verificar la conexión a la base de datos
      try {
        await Task.sequelize?.authenticate();
        console.log("✅ Conexión a la base de datos establecida correctamente");
      } catch (dbError) {
        console.error("❌ Error al conectar con la base de datos:", dbError);
        return res.status(500).json({
          error: "Error de conexión a la base de datos",
          message: "No se pudo establecer conexión con la base de datos",
        });
      }

      // Obtener las tareas
      console.log(`🔎 Buscando tareas en la base de datos...`);
      const tasks = await Task.findAll({
        where: { task_type: normalizedType },
        include: [
          {
            model: taskModel,
            as: normalizedType,
            required: false,
          },
        ],
      });

      console.log(
        `✅ Se encontraron ${tasks.length} tareas de tipo ${normalizedType}`
      );
      return res.json(tasks);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      const errorStack = error instanceof Error ? error.stack : undefined;

      console.error("❌ Error en getTaskByType:", {
        error: errorMessage,
        stack: errorStack,
        type,
        timestamp: new Date().toISOString(),
      });

      return res.status(500).json({
        error: "Error al obtener las tareas",
        message: errorMessage,
        requestId: Date.now(),
        ...(process.env.NODE_ENV === "development" && { stack: errorStack }),
      });
    }
  },

  //actualizar tarea
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
