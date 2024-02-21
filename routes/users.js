import { Router } from "express";
import { getUsers, login, signup } from "../controllers/users-controller.js";
import { check } from "express-validator";

export const router = Router();

router.get("/", getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);

export default router;
