import type { Request, Response } from "express";
import {
  Task,
  SpeakingTask,
  ListeningTask,
  ReadingTask,
  WritingTask,
  setupAssociations,
} from "../models/index.js";
import { Notification } from "../models/notification.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { Op, fn, col, where } from "sequelize";

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

const TARGET_ROLES = ["lider", "asegurador", "lider_proyecto", "qa"];

const getUserFromToken = async (req: Request) => {
  const headerToken = req.headers["authorization"];
  if (!headerToken || !headerToken.startsWith("Bearer ")) return null;

  const token = headerToken.slice(7);
  const decoded: any = jwt.verify(
    token,
    process.env.SECRET_KEY || "Jdz237797TH1dp7zjFzM",
  );

  const user = await User.findOne({ where: { email: decoded.email } });
  return user;
};

const createNotificationsForTask = async (
  task: Task,
  senderName: string | null,
  transaction: any,
) => {
  const recipients = await User.findAll({
    where: { rol: { [Op.in]: TARGET_ROLES } },
    attributes: ["id", "name", "lastname", "rol"],
    transaction,
  });

  if (!recipients.length) return;

  const notifications = recipients.map((recipient) => ({
    task_id: task.task_id,
    title: "Nueva tarea para revisar",
    message: `Se creó la tarea ${task.task_id} (${task.task_type}) por ${senderName ?? "un profesor"}. Revisa y deja feedback.`,
    status: "unread" as const,
    recipient_id: (recipient as any).id,
    recipient_role: (recipient as any).rol,
    sender_id: null,
    sender_name: senderName,
  }));

  await Notification.bulkCreate(notifications, { transaction });
};

export default {
  // Crear una tarea con su subtipo
  async createTask(req: Request, res: Response) {
    const transaction = await Task.sequelize?.transaction();
    try {
      const { task_type, task_id, name_of_item_writer, team, date, status } =
        req.body;

      if (task_id) {
        const existingTask = await Task.findOne({
          where: { task_id },
          transaction,
        });
        if (existingTask) {
          return res.status(400).json({ error: "task_id ya existe" });
        }
      }

      const currentUser = await getUserFromToken(req);
      const senderName = currentUser?.get
        ? `${currentUser.get("name")} ${currentUser.get("lastname")}`
        : (name_of_item_writer ?? null);

      // Crear Task base
      const task = await Task.create(
        {
          task_id,
          task_type,
          name_of_item_writer,
          team,
          date,
          status,
        },
        { transaction },
      );

      // Crear subtipo según task_type
      switch (task_type) {
        case "listening":
          await ListeningTask.create(
            {
              task_id: task_id,
              ...req.body,
              feedback_provided_by: null,
              feedback_team: null,
              feedback_date: null,
              feedback_text: null,
            },
            { transaction },
          );
          break;
        case "speaking":
          await SpeakingTask.create(
            {
              task_id: task_id,
              ...req.body,
              feedback_provided_by: null,
              feedback_team: null,
              feedback_date: null,
              feedback_text: null,
            },
            { transaction },
          );
          break;
        case "reading":
          await ReadingTask.create(
            {
              task_id: task_id,
              ...req.body,
              feedback_provided_by: null,
              feedback_team: null,
              feedback_date: null,
              feedback_text: null,
            },
            { transaction },
          );
          break;
        case "writing":
          await WritingTask.create(
            {
              task_id: task_id,
              ...req.body,
              feedback_provided_by: null,
              feedback_team: null,
              feedback_date: null,
              feedback_text: null,
            },
            { transaction },
          );
          break;
        default:
          return res.status(400).json({ error: "Tipo de tarea no válido" });
      }

      await createNotificationsForTask(task, senderName, transaction);

      await transaction?.commit();
      return res.status(201).json({ message: "Tarea creada", task });
    } catch (error) {
      await transaction?.rollback();
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
          `❌ No se pudo encontrar el modelo para: ${normalizedType}`,
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
        `✅ Se encontraron ${tasks.length} tareas de tipo ${normalizedType}`,
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

  // Obtener todas las tareas asociadas a un usuario (por nombre o equipo)
  async getTasksByUser(req: Request, res: Response) {
    try {
      const { user } = req.params;
      if (!user || !user.trim()) {
        return res.status(400).json({
          error: "Debe proporcionar el identificador del usuario",
        });
      }

      const normalizedUser = user.toLowerCase().trim();

      const tasks = await Task.findAll({
        where: {
          [Op.or]: [
            where(fn("LOWER", col("name_of_item_writer")), normalizedUser),
            where(fn("LOWER", col("team")), normalizedUser),
          ],
        },
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
      return res.status(500).json({
        error: "Error obteniendo las tareas del usuario",
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

      const resolvedTaskType = String(task_type ?? task.get("task_type") ?? "")
        .toLowerCase()
        .trim();
      const resolvedTaskId = String(task.get("task_id"));

      await task.update({
        name_of_item_writer: data.name_of_item_writer,
        team: data.team,
        date: data.date,
        status: data.status,
      });

      const listeningPayload = {
        text_source: data.text_source,
        where_found: data.where_found,
        authenticity: data.authenticity,
        text_input_type: data.text_input_type,
        discourse_type: data.discourse_type,
        main_topic_area: data.main_topic_area,
        nature_of_content: data.nature_of_content,
        vocabulary: data.vocabulary,
        grammar: data.grammar,
        length_of_input: data.length_of_input,
        number_of_participants: data.number_of_participants,
        accents: data.accents,
        speed_of_delivery: data.speed_of_delivery,
        clarity_of_articulation: data.clarity_of_articulation,
        comprehensible_cefr_level: data.comprehensible_cefr_level,
        item_characteristics: data.item_characteristics,
        time_to_do_total_task_minutes: data.time_to_do_total_task_minutes,
        task_level_estimated: data.task_level_estimated,
        test_task: data.test_task,
        answer_key: data.answer_key,
        comments: data.comments,
        feedback_provided_by: data.feedback_provided_by,
        feedback_team: data.feedback_team,
        feedback_date: data.feedback_date || null,
        feedback_text: data.feedback_text,
      };

      switch (resolvedTaskType) {
        case "speaking":
          await SpeakingTask.upsert({
            task_id: resolvedTaskId,
            ...data,
          });
          break;
        case "listening":
          await ListeningTask.upsert({
            task_id: resolvedTaskId,
            ...listeningPayload,
          });

          break;
        case "reading":
          await ReadingTask.upsert({
            task_id: resolvedTaskId,
            ...data,
          });
          break;
        case "writing":
          await WritingTask.upsert({
            task_id: resolvedTaskId,
            ...data,
          });
          break;
        default:
          return res.status(400).json({ error: "Tipo de tarea no válido" });
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
