import { Router } from "express";
import { getUsers, login, signup } from "../controllers/users-controller.js";

export const router = Router();

router.get("/", getUsers);

router.post("/signup", signup);

router.post("/login", login);

export default router;
