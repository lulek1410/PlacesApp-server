import express from "express";

import placesRoutes from "./routes/places.js";
import usersRouter from "./routes/users.js";

import { HttpError } from "./models/http-errors.js";
import mongoose from "mongoose";
import { unlink } from "fs";
import path from "path";

const app = express();

app.use(express.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  throw new HttpError("Coluld not find this route", 404);
});

app.use((error, req, res, next) => {
  if (req.file) {
    unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://Janek:MnqYcUz4bc7mncC2@cluster0.7tr11tj.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));
