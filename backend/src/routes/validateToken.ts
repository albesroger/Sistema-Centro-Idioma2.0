import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const validaterToken = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers["authorization"];
  console.log(headerToken);

  if (headerToken != undefined && headerToken.startsWith("Bearer ")) {
    try {
      const token = headerToken.slice(7);
      jwt.verify(token, process.env.SECRET_KEY || "Jdz237797TH1dp7zjFzM");
      next();
    } catch (error) {
      res.status(401).json({
        msg: "Se ha cerrado tu sesion ",
      });
    }
  } else {
    res.status(401).json({
      msg: "Token no encontrado",
    });
  }
};

export default validaterToken;
