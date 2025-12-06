import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../database/connection.js";
import { Task } from "./task.js";
import { User } from "./user.js";

interface NotificationAttributes {
  id: number;
  task_id: string;
  title: string;
  message: string;
  status: "unread" | "read";
  sender_id?: number | null;
  sender_name?: string | null;
  recipient_id?: number | null;
  recipient_role?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type NotificationCreationAttributes = Optional<
  NotificationAttributes,
  "id" | "status" | "sender_id" | "sender_name" | "recipient_id" | "recipient_role" | "createdAt" | "updatedAt"
>;

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: number;
  public task_id!: string;
  public title!: string;
  public message!: string;
  public status!: "unread" | "read";
  public sender_id?: number | null;
  public sender_name?: string | null;
  public recipient_id?: number | null;
  public recipient_role?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Task,
        key: "task_id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("unread", "read"),
      defaultValue: "unread",
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    sender_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    recipient_role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;
