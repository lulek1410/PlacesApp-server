import { v4 as uuidv4 } from "uuid";
import { HttpError } from "../models/http-errors.js";

let DUMMY_PLACES = [
  {
    id: "1",
    title: "Empire state building",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium provident culpa fugit eveniet quidem ut eligendi vitae earum incidunt repellendus facilis nam blanditiis quo adipisci iste, fuga maiores, accusamus corrupti?",
    image: "https://media.timeout.com/images/101705309/image.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484445,
      lng: -73.9882447,
    },
    creator: "1",
  },
  {
    id: "2",
    title: "Empire state building",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium provident culpa fugit eveniet quidem ut eligendi vitae earum incidunt repellendus facilis nam blanditiis quo adipisci iste, fuga maiores, accusamus corrupti?",
    image: "https://media.timeout.com/images/101705309/image.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484445,
      lng: -73.9882447,
    },
    creator: "1",
  },
  {
    id: "3",
    title: "Emp. state building",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium provident culpa fugit eveniet quidem ut eligendi vitae earum incidunt repellendus facilis nam blanditiis quo adipisci iste, fuga maiores, accusamus corrupti?",
    image: "https://media.timeout.com/images/101705309/image.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484445,
      lng: -73.9882447,
    },
    creator: "1",
  },
];

export const getPlaceById = (req, res, next) => {
  const id = req.params.id;
  const places = DUMMY_PLACES.find((place) => place.id === id);
  if (!places) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  res.json(places);
};

export const getPlacesByUserId = (req, res) => {
  const id = req.params.id;
  const places = DUMMY_PLACES.filter((place) => place.creator === id);
  if (!places.length) {
    throw new HttpError("Could not find places for the provided user id", 404);
  }
  res.json(places);
};

export const createPlace = (req, res) => {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ createdPlace });
};

export const updatePlace = (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const updatedPlace = { ...DUMMY_PLACES.find((place) => place.id === id) };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === id);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json(updatedPlace);
};

export const deletePlace = (req, res) => {
  const id = req.params.id;
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== id);
  res.status(200).json({ message: `Place with id:${id} has been deleted` });
};
