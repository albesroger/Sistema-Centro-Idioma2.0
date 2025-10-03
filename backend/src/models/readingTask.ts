import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import { Task } from "./task.js";

export const ReadingTask = sequelize.define("ReadingTask", {
  task_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: Task,
      key: "task_id"
    }
  },
  text_source: DataTypes.TEXT,
  where_found: DataTypes.TEXT,
  authenticity: DataTypes.STRING,
  text_type: DataTypes.STRING,
  form: DataTypes.STRING,
  discourse_type: DataTypes.STRING,
  main_topic_area: DataTypes.TEXT,
  nature_of_content: DataTypes.TEXT,
  vocabulary: DataTypes.TEXT,
  grammar: DataTypes.TEXT,
  number_of_words: DataTypes.INTEGER,
  comprehensible_cefr_level: DataTypes.STRING,
  item_characteristics: DataTypes.TEXT,
  time_to_do_total_task_minutes: DataTypes.INTEGER,
  task_level_estimated: DataTypes.STRING,
  test_task: DataTypes.TEXT,
  answer_key: DataTypes.TEXT,
  comments: DataTypes.TEXT,
  feedback_provided_by: DataTypes.STRING,
  feedback_team: DataTypes.STRING,
  feedback_date: DataTypes.DATE,
  feedback_text: DataTypes.TEXT
}, {
  tableName: "reading_tasks",
  timestamps: false
});


