import express from "express";
import type { Application } from "express";
import RUser from "../routes/user.js";
import { User } from "../models/user.js";
import cors from "cors";
import RTask from "../routes/task.js";
import { Task } from "../models/task.js";

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3017";
    this.listen();
    this.middlewares();
    this.router();
    this.DBconnect();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Se ejecuta el puerto: " + this.port);
    });
  }

  router() {
    this.app.use(RUser);
    this.app.use(RTask);
  }
  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  async DBconnect() {
    try {
      await User.sync({});
      await Task.sync({});
      console.log("Base de datos sincronizada");
      console.log("Conexion exitosa");
    } catch (error) {
      console.log("Error de conexion");
    }
  }
}

export default Server;
