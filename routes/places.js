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

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "It works!" });
});

router.get("/:id", getPlaceById);
router.patch(
  "/:id",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);
router.delete("/:id", deletePlace);

router.get("/user/:id", getPlacesByUserId);

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
