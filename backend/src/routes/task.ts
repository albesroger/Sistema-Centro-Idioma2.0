import { Router } from "express";
import taskController from "../controllers/taskcontroller.js";

const router = Router();

router.post("/", taskController.createTask);

export default router;
