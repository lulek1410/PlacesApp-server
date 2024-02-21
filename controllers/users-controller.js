import { v4 as uuidv4 } from "uuid";
import { HttpError } from "../models/http-errors.js";

let DUMMY_USERS = [
  {
    id: "1",
    name: "Mike Shwartz",
    email: "test@test.com",
    password: "test",
  },
];

export const getUsers = (req, res, next) => {
  res.status(200).json(DUMMY_USERS);
};

export const signup = (req, res) => {
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((user) => user.email === email);
  if (hasUser) {
    throw new HttpError("User with this email already exists", 422);
  }
  const newPlace = { name, email, password, id: uuidv4() };
  DUMMY_USERS.push({ name, email, password, id: uuidv4(), places: 0 });
  res.status(201).json(newPlace);
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const auth = DUMMY_USERS.find(
    (user) => user.email === email && user.password === password
  );
  console.log(auth);
  if (auth) {
    res.status(200).json({ message: "Logged in succesfully" });
  } else {
    throw new HttpError("Incorrect email or password", 401);
  }
};
