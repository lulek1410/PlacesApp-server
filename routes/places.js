import express from "express";
import { check } from "express-validator";

import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
} from "../controllers/places-controller.js";
import { fileUpload } from "../middleware/file-upload.js";
import { auth } from "../models/auth.js";

const router = express.Router();

router.get("/:id", getPlaceById);
router.get("/user/:id", getPlacesByUserId);

router.use(auth);

router.patch(
  "/:id",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);
router.delete("/:id", deletePlace);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

export default router;
