import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Notification } from "../models/notification.js";
import { User } from "../models/user.js";

const getUserFromToken = async (req: Request) => {
  const headerToken = req.headers["authorization"];
  if (!headerToken || !headerToken.startsWith("Bearer ")) return null;

  const token = headerToken.slice(7);
  const decoded: any = jwt.verify(
    token,
    process.env.SECRET_KEY || "Jdz237797TH1dp7zjFzM"
  );

  const user = await User.findOne({ where: { email: decoded.email } });
  return user;
};

export default {
  async listMyNotifications(req: Request, res: Response) {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ msg: "Usuario no autorizado" });
      }

      const notifications = await Notification.findAll({
        where: { recipient_id: (user as any).id },
        order: [["createdAt", "DESC"]],
      });

      return res.json(notifications);
    } catch (error) {
      console.error("Error listMyNotifications:", error);
      return res.status(500).json({ msg: "Error obteniendo notificaciones" });
    }
  },

  async markAsRead(req: Request, res: Response) {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ msg: "Usuario no autorizado" });
      }

      const { id } = req.params;
      const [updated] = await Notification.update(
        { status: "read" },
        { where: { id, recipient_id: (user as any).id } }
      );

      if (!updated) {
        return res.status(404).json({ msg: "Notificación no encontrada" });
      }

      return res.json({ msg: "Notificación marcada como leída" });
    } catch (error) {
      console.error("Error markAsRead:", error);
      return res.status(500).json({ msg: "Error al marcar como leída" });
    }
  },

  async markAllAsRead(req: Request, res: Response) {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ msg: "Usuario no autorizado" });
      }

      await Notification.update(
        { status: "read" },
        { where: { recipient_id: (user as any).id } }
      );

      return res.json({ msg: "Todas las notificaciones marcadas como leídas" });
    } catch (error) {
      console.error("Error markAllAsRead:", error);
      return res.status(500).json({ msg: "Error al marcar todas como leídas" });
    }
  },
};
