import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import {Task} from "./task.js";

export const ListeningTask = sequelize.define("ListeningTask", {
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
  text_input_type: DataTypes.STRING,
  discourse_type: DataTypes.STRING,
  main_topic_area: DataTypes.TEXT,
  nature_of_content: DataTypes.TEXT,
  vocabulary: DataTypes.TEXT,
  grammar: DataTypes.TEXT,
  length_of_input: DataTypes.STRING,
  number_of_participants: DataTypes.INTEGER,
  accents: DataTypes.STRING,
  speed_of_delivery: DataTypes.STRING,
  clarity_of_articulation: DataTypes.STRING,
  comprehensible_cefr_level: DataTypes.STRING,
  item_characteristics: DataTypes.TEXT,  // puedes guardar JSON.stringify
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
  tableName: "listening_tasks",
  timestamps: false
});


