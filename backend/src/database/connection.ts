import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "db_CENID",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "root-123",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    dialectOptions:
      process.env.DB_SSL === "true"
        ? { ssl: { rejectUnauthorized: false } }
        : {},
  },
);

export default sequelize;
