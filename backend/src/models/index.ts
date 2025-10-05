import { Task } from "./task.js";
import { SpeakingTask } from "./speakingTask.js";
import { ListeningTask } from "./listeningTask.js";
import { ReadingTask } from "./readingTask.js";
import { WritingTask } from "./writingTask.js";

// Define associations
const setupAssociations = () => {
  // Task associations
  Task.hasOne(SpeakingTask, {
    foreignKey: "task_id",
    as: "speaking",
  });
  SpeakingTask.belongsTo(Task, { 
    foreignKey: "task_id",
    as: "task"
  });

  Task.hasOne(ListeningTask, {
    foreignKey: "task_id",
    as: "listening",
  });
  ListeningTask.belongsTo(Task, { 
    foreignKey: "task_id",
    as: "task"
  });

  Task.hasOne(ReadingTask, {
    foreignKey: "task_id",
    as: "reading",
  });
  ReadingTask.belongsTo(Task, { 
    foreignKey: "task_id",
    as: "task"
  });

  Task.hasOne(WritingTask, {
    foreignKey: "task_id",
    as: "writing",
  });
  WritingTask.belongsTo(Task, { 
    foreignKey: "task_id",
    as: "task"
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
  setupAssociations
};
