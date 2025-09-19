import express, { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controller.ts";

const router: Router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);
export default router;
