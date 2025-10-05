import { Router } from "express";
import taskController from "../controllers/taskcontroller.js";

const router = Router();

router.post("/api/tasks/createTask", taskController.createTask);
router.get("/api/tasks/getTasks", taskController.getAllTasks);
router.get("/api/tasks/getTaskById/:id", taskController.getTaskById);
router.put("/api/tasks/updateTask/:id", taskController.updateTask);
router.delete("/api/tasks/deleteTask/:id", taskController.deleteTask);

export default router;
