import { Router } from "express";
import taskController from "../controllers/taskcontroller.js";
import validaterToken from "./validateToken.js";
import requireRole from "../middleware/requireRole.js";

const router = Router();

router.post(
  "/api/tasks/createTask",
  validaterToken,
  requireRole(["profesor", "lider", "qa", "admin"]),
  taskController.createTask,
);
router.get("/api/tasks/getTasks", validaterToken, taskController.getAllTasks);
router.get(
  "/api/tasks/getTaskById/:id",
  validaterToken,
  taskController.getTaskById,
);
router.get(
  "/api/tasks/getTaskByType/:type",
  validaterToken,
  taskController.getTaskByType,
);
router.get(
  "/api/tasks/getTasksByUser/:user",
  validaterToken,
  taskController.getTasksByUser,
);
router.put(
  "/api/tasks/updateTask/:id",
  validaterToken,
  requireRole(["lider", "qa", "admin"]),
  taskController.updateTask,
);
router.delete(
  "/api/tasks/deleteTask/:id",
  validaterToken,
  requireRole(["lider", "qa", "admin"]),
  taskController.deleteTask,
);

export default router;
