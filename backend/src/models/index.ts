import { Task } from "../models/task";
import { SpeakingTask } from "./speakingTask";
import { ListeningTask } from "./listeningTask";
import { ReadingTask } from "./readingTask";
import { WritingTask } from "./writingTask";

// Associations
Task.hasOne(SpeakingTask, {
  foreignKey: "task_id",
  as: "speaking",
});
SpeakingTask.belongsTo(Task, { foreignKey: "task_id" });

Task.hasOne(ListeningTask, {
  foreignKey: "task_id",
  as: "listening",
});
ListeningTask.belongsTo(Task, { foreignKey: "task_id" });

Task.hasOne(ReadingTask, {
  foreignKey: "task_id",
  as: "reading",
});
ReadingTask.belongsTo(Task, { foreignKey: "task_id" });

Task.hasOne(WritingTask, {
  foreignKey: "task_id",
  as: "writing",
});
WritingTask.belongsTo(Task, { foreignKey: "task_id" });

export { Task, SpeakingTask, ListeningTask, ReadingTask, WritingTask };
