import express from "express";
import type { Application } from "express";
import RUser from "../routes/user.js";
import { User } from "../models/user.js";
import cors from "cors";
import RTask from "../routes/task.js";
import { Task } from "../models/task.js";
import { Notification } from "./notification.js";
import RNotification from "../routes/notification.js";

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

  private listen() {
    this.app.listen(this.port, () => {
      console.log("Se ejecuta el puerto: " + this.port);
    });
  }

  router() {
    this.app.use(RUser);
    this.app.use(RTask);
    this.app.use(RNotification);
  }
  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  async DBconnect() {
    try {
      console.log("🔌 Conectando a la base de datos...");

      // Importar todos los modelos primero
      const models = await import("./index.js");
      console.log("✅ Modelos importados correctamente");

      // Sincronizar modelos base
      console.log("🔄 Sincronizando modelos base...");
      await Promise.all([
        User.sync({ alter: true }),
        Task.sync({ alter: true }),
      ]);

      // Sincronizar modelos de tareas
      console.log("🔄 Sincronizando modelos de tareas...");
      await Promise.all([
        models.SpeakingTask.sync({ alter: true }),
        models.ListeningTask.sync({ alter: true }),
        models.ReadingTask.sync({ alter: true }),
        models.WritingTask.sync({ alter: true }),
        Notification.sync(), // no alter: evitamos errores al gestionar FKs existentes
      ]);

      console.log("✅ Base de datos sincronizada correctamente");
      console.log("🚀 Conexión exitosa a la base de datos");
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      throw error; // Propagar el error para que se muestre en la consola
    }
  }
  async start() {
    try {
      await this.DBconnect();
      this.listen();
    } catch (error) {
      console.error("❌ No se pudo iniciar el servidor:", error);
      process.exit(1);
    }
  }
}

export default Server;
