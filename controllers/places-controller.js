import { validationResult } from "express-validator";

import { startSession } from "mongoose";
import { HttpError } from "../models/http-errors.js";
import { Place } from "../models/place.js";
import { User } from "../models/user.js";
import { getCoordsForAddress } from "../util/location.js";
import { unlink } from "fs";

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
    return next(new HttpError("Something went wrong, could not find places.", 500));
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
  const { title, description, address } = req.body;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id", 404));
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  });

  try {
    const session = await startSession();
    session.startTransaction();
    await createdPlace.save({ session });
    user.places.push(createdPlace);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  res.status(201).json({ createdPlace });
};

export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }

  const id = req.params.id;
  const { title, description } = req.body;
  let place;
  try {
    place = await Place.findById(id);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update place", 500)
    );
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(
      new HttpError("You are not authorized to edit this place", 401)
    );
  }

  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update place", 500)
    );
  }

  res.status(200).json(place.toObject({ getters: true }));
};

export const deletePlace = async (req, res, next) => {
  const id = req.params.id;
  let session;
  let imagePath;
  try {
    session = await startSession();
    session.startTransaction();
    const place = await Place.findById(id).populate("creator");
    if (!place) {
      return next(new HttpError("Could not find place for provided id.", 404));
    }

    if (place.creator.id !== req.userData.userId) {
      return next(
        new HttpError("You are not authorized to delete this place", 401)
      );
    }

    imagePath = place.image;

    place.creator.places.pull(place);
    await place.creator.save({ session });
    await Place.findByIdAndDelete(id, { session });
    await session.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find place.", 500)
    );
  } finally {
    if (session) {
      session.endSession();
    }
  }

  unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: `Place with id:${id} has been deleted` });
};
