import express from "express";
import { nextTick } from "process";
import { HttpError } from "../models/http-errors";

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: 1,
    title: "Empire state building",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium provident culpa fugit eveniet quidem ut eligendi vitae earum incidunt repellendus facilis nam blanditiis quo adipisci iste, fuga maiores, accusamus corrupti?",
    image: "https://media.timeout.com/images/101705309/image.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484445,
      lng: -73.9882447,
    },
    creator: 1,
  },
  {
    id: 2,
    title: "Empire state building",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium provident culpa fugit eveniet quidem ut eligendi vitae earum incidunt repellendus facilis nam blanditiis quo adipisci iste, fuga maiores, accusamus corrupti?",
    image: "https://media.timeout.com/images/101705309/image.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484445,
      lng: -73.9882447,
    },
    creator: 1,
  },
  {
    id: 3,
    title: "Emp. state building",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium provident culpa fugit eveniet quidem ut eligendi vitae earum incidunt repellendus facilis nam blanditiis quo adipisci iste, fuga maiores, accusamus corrupti?",
    image: "https://media.timeout.com/images/101705309/image.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484445,
      lng: -73.9882447,
    },
    creator: 1,
  },
];

router.get("/", (req, res) => {
  console.log("GET request in places");
  res.json({ message: "It works!" });
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const places = DUMMY_PLACES.find((place) => place.id === id);
  if (!places) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  res.json(places);
});

router.get("/user/:id", (req, res) => {
  const id = Number(req.params.id);
  const places = DUMMY_PLACES.filter((place) => place.creator === id);
  if (!places.length) {
    throw new HttpError("Could not find places for the provided user id", 404);
  }
  res.json(places);
});

export default router;
