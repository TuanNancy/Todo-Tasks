import express from "express";
import { register, login, logout, getMe } from "../controllers/authControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getMe);

export default router;
