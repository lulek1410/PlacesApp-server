import express from "express";

import placesRoutes from "./routes/places.js";
import usersRouter from "./routes/users.js";

import { HttpError } from "./models/http-errors.js";

const app = express();

app.use(express.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  throw new HttpError("Coluld not find this route", 404);
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
