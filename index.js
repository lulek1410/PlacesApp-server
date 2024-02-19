import express from "express";

import placesRoutes from "./routes/places.js";

const app = express();

app.use("/api/places", placesRoutes);
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
