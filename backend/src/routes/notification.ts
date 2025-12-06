import { Router } from "express";
import notificationController from "../controllers/notification.js";
import validaterToken from "./validateToken.js";

const router = Router();

router.get("/api/notifications/me", validaterToken, notificationController.listMyNotifications);
router.post("/api/notifications/mark-read/:id", validaterToken, notificationController.markAsRead);
router.post("/api/notifications/mark-all-read", validaterToken, notificationController.markAllAsRead);

export default router;
