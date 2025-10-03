import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Task = sequelize.define("Task", {
  task_id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  task_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name_of_item_writer: {
    type: DataTypes.STRING
  },
  team: {
    type: DataTypes.STRING
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  tableName: "tasks",
  timestamps: false
});


