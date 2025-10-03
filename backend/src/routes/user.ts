import { Router } from "express";
import {
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
router.get("/api/user/getUser", validaterToken, getUser);
router.delete("/api/user/deleteUser/:id", validaterToken, deleteUser);
router.put("/api/user/updateUser", validaterToken, updateUser);

export default router;
