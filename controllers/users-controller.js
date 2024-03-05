import { validationResult } from "express-validator";
import { HttpError } from "../models/http-errors.js";
import { User } from "../models/user.js";

export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(
      HttpError("Fetching users failed, please try again later.", 500)
    );
  }
  res.status(200).json(users.map((user) => user.toObject({ getters: true })));
};

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    console.log(existingUser);
  } catch (err) {
    return next(HttpError("Sign up failed, please try again later.", 500));
  }
  if (existingUser) {
    return next(
      new HttpError("User already exists, please log in instead", 422)
    );
  }

  const newUser = new User({
    name,
    email,
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg",
    password,
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(HttpError("Sign up failed, please try again later.", 500));
  }

  res.status(201).json(newUser.toObject({ getters: true }));
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    console.log(existingUser);
  } catch (err) {
    return next(HttpError("Log in failed, please try again later.", 500));
  }
  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Invalid credentials, could not log in", 402));
  }

  res.status(200).json({ message: "Logged in succesfully" });
};
