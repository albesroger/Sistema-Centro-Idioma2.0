import { Sequelize } from "sequelize";

const sequelize = new Sequelize("db_CENID", "root", "root-123", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
