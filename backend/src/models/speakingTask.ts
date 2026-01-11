import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import { Task } from "./task.js";

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
    main_topic_area: DataTypes.TEXT,
    nature_of_content: DataTypes.TEXT,
    expected_vocabulary: DataTypes.TEXT,
    prompt_type: DataTypes.TEXT,
    targetted_outcomes: DataTypes.TEXT,
    task_section_task: DataTypes.TEXT,
    time_to_do_total_task_minutes: DataTypes.INTEGER,
    task_level_estimated: DataTypes.STRING,
    comments: DataTypes.TEXT,
    feedback_provided_by: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    feedback_team: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    feedback_date: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    feedback_text: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    expected_outcomes: DataTypes.TEXT,
    test_task: DataTypes.TEXT,
  },
  {
    tableName: "speaking_tasks",
    timestamps: false,
  }
);
