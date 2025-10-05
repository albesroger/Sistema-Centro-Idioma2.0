import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../database/connection.js";

interface TaskAttributes {
  task_id: string;
  task_type: string;
  name_of_item_writer?: string;
  team?: string;
  date?: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'task_id'> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public task_id!: string;
  public task_type!: string;
  public name_of_item_writer?: string;
  public team?: string;
  public date?: Date;
}

Task.init(
  {
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
  },
  {
    sequelize,
    tableName: "tasks",
    timestamps: false
  }
);

export default Task;
