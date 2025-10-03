import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import { Task } from "./task.js";

export const WritingTask = sequelize.define(
  "WritingTask",
  {
    task_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: Task,
        key: "task_id",
      },
    },
    original_task_name: DataTypes.TEXT,
    task_type: DataTypes.STRING,
    main_topic_area: DataTypes.TEXT,
    nature_of_content: DataTypes.TEXT,
    expected_vocabulary: DataTypes.TEXT,
    prompt_type: DataTypes.TEXT,
    time_to_do_total_task_minutes: DataTypes.INTEGER,
    task_level_estimated: DataTypes.STRING,
    expected_outcomes: DataTypes.TEXT,
    test_task: DataTypes.TEXT,
    comments: DataTypes.TEXT,
    feedback_provided_by: DataTypes.STRING,
    feedback_team: DataTypes.STRING,
    feedback_date: DataTypes.DATE,
    feedback_text: DataTypes.TEXT,
  },
  {
    tableName: "writing_tasks",
    timestamps: false,
  }
);
