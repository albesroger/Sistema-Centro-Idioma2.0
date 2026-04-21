import { Router } from "express";
import {
  changePassword,
  deleteUser,
  getUser,
  loadUser,
  login,
  register,
  updateUser,
} from "../controllers/user.js";
import validaterToken from "./validateToken.js";

const router = Router();

router.post("/api/user/register", register);
router.post("/api/user/login", login);
router.get("/api/user/loadUser", validaterToken, loadUser);
router.put("/api/user/changePassword", validaterToken, changePassword);
router.get("/api/user/getUser", validaterToken, getUser);
router.put("/api/user/updateUser/:id", validaterToken, updateUser);
router.delete("/api/user/deleteUser/:id", validaterToken, deleteUser);

export default router;
