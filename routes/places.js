import express from "express";
import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
} from "../controllers/places-controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "It works!" });
});

router.get("/:id", getPlaceById);
router.patch("/:id", updatePlace);
router.delete("/:id", deletePlace);

router.get("/user/:id", getPlacesByUserId);

router.post("/", createPlace);

export default router;
