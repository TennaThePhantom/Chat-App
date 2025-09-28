import express, { Router } from "express";
import {
	signup,
	login,
	logout,
	updateProfile,
    checkAuth
} from "../controllers/auth.controller.ts";

import { protectRoute } from "../middleware/auth.middleware.ts";
const router: Router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth)
export default router;
