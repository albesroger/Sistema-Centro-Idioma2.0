import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const normalizeRole = (role: unknown) => {
  const normalized = String(role ?? "")
    .toLowerCase()
    .trim();

  if (normalized === "qa") return "calidad";
  return normalized;
};

export default function requireRole(allowed: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers["authorization"];
    if (
      !headerToken ||
      typeof headerToken !== "string" ||
      !headerToken.startsWith("Bearer ")
    ) {
      return res.status(401).json({ msg: "Token no encontrado" });
    }

    try {
      const token = headerToken.slice(7);
      const decoded: any = jwt.verify(
        token,
        process.env.SECRET_KEY || "Jdz237797TH1dp7zjFzM",
      );

      const email = decoded?.email;
      if (!email) return res.status(401).json({ msg: "Token inválido" });

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(403).json({ msg: "Usuario no encontrado" });

      const role = normalizeRole(
        (user as any).rol || decoded?.rol || decoded?.role,
      );
      const allowedRoles = new Set(allowed.map((item) => normalizeRole(item)));

      if (role === "admin") return next();

      if (!allowedRoles.has(role)) {
        return res.status(403).json({ msg: "Permiso denegado" });
      }

      return next();
    } catch (error) {
      console.error("requireRole error:", error);
      return res.status(401).json({ msg: "Token inválido" });
    }
  };
}
