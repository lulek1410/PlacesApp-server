import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import { HttpError } from "../models/http-errors.js";
import { getCoordsForAddress } from "../util/location.js";
import { Place } from "../models/place.js";

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

export const getPlaceById = async (req, res, next) => {
  const id = req.params.id;
  let place;
  try {
    place = await Place.findById(id);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find the place.", 500)
    );
  }
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  res.json(place.toObject({ getters: true }));
};

export const getPlacesByUserId = async (req, res, next) => {
  const id = req.params.id;
  let place;
  try {
    place = await Place.find({ creator: id });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong, could not find places."));
  }
  if (!place) {
    return next(
      new HttpError("Could not find places for the provided user id", 404)
    );
  }

  res.json(place.map((place) => place.toObject({ getters: true })));
};

export const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }
  let coordinates;
  const { title, description, address, creator } = req.body;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "https://media.timeout.com/images/101705309/image.jpg",
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  res.status(201).json({ createdPlace });
};

export const updatePlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input passed, please check your data", 422);
  }

  const id = req.params.id;
  const { title, description } = req.body;
  let updatedPlace;
  try {
    updatedPlace = await Place.findByIdAndUpdate(
      id,
      { title, description },
      { returnDocument: "after" }
    );
    console.log(updatedPlace);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update place", 500)
    );
  }

  res.status(200).json(updatedPlace.toObject({ getters: true }));
};

export const deletePlace = async (req, res) => {
  const id = req.params.id;
  let place;
  try {
    place = await Place.findByIdAndDelete(id);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not fond place.", 500)
    );
  }

  res.status(200).json({ message: `Place with id:${id} has been deleted` });
};
