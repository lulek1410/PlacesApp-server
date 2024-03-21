import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";
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
  } catch (err) {
    return next(HttpError("Sign up failed, please try again later.", 500));
  }
  if (existingUser) {
    return next(
      new HttpError("User already exists, please log in instead", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(HttpError("Sign up failed, please try again later.", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(HttpError("Sign up failed, please try again later.", 500));
  }

  res.status(201).json({ userId: newUser.id, email: newUser.email, token });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(HttpError("Log in failed, please try again later.", 500));
  }
  if (!existingUser) {
    return next(new HttpError("Invalid credentials, could not log in", 400));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not log in, please check your credentials and try again."
      )
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials, could not log in", 400));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(HttpError("Logging in failed, please try again later.", 500));
  }

  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  });
};
