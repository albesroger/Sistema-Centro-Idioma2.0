import { DataTypes } from "sequelize";
import sequelize from "../database/connection";
import { Task } from "./task";

export const SpeakingTask = sequelize.define(
  "SpeakingTask",
  {
    task_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: Task,
        key: "task_id",
      },
    },
    section: DataTypes.STRING,
    task_type: DataTypes.STRING,
    main_topic_area: DataTypes.TEXT,
    nature_of_content: DataTypes.TEXT,
    expected_vocabulary: DataTypes.TEXT,
    prompt_type: DataTypes.TEXT,
    time_to_do_total_task_minutes: DataTypes.INTEGER,
    task_level_estimated: DataTypes.STRING,
    targetted_outcomes: DataTypes.TEXT,
    task_section_task: DataTypes.TEXT,
    comments: DataTypes.TEXT,
    feedback_provided_by: DataTypes.STRING,
    feedback_team: DataTypes.STRING,
    feedback_date: DataTypes.DATE,
    feedback_text: DataTypes.TEXT,
  },
  {
    tableName: "speaking_tasks",
    timestamps: false,
  }
);
