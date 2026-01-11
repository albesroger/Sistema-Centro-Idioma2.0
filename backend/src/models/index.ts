import { Task } from "./task.js";
import { SpeakingTask } from "./speakingTask.js";
import { ListeningTask } from "./listeningTask.js";
import { ReadingTask } from "./readingTask.js";
import { WritingTask } from "./writingTask.js";
import { Notification } from "./notification.js";

// Define associations
const setupAssociations = () => {
  // Task associations
  Task.hasOne(SpeakingTask, {
    foreignKey: "task_id",
    as: "speaking",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });
  SpeakingTask.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });

  Task.hasOne(ListeningTask, {
    foreignKey: "task_id",
    as: "listening",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });
  ListeningTask.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });

  Task.hasOne(ReadingTask, {
    foreignKey: "task_id",
    as: "reading",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });
  ReadingTask.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });

  Task.hasOne(WritingTask, {
    foreignKey: "task_id",
    as: "writing",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });
  WritingTask.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });

  Task.hasMany(Notification, {
    foreignKey: "task_id",
    as: "notifications",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });
  Notification.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    constraints: true,
  });

  console.log("All associations have been set up successfully.");
};

// Export models
export {
  Task,
  SpeakingTask,
  ListeningTask,
  ReadingTask,
  WritingTask,
  Notification,
  setupAssociations,
};
