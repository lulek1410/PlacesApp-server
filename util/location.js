import axios from "axios";
import { HttpError } from "../models/http-errors.js";

const API_KEY = "AIzaSyBu9lM5qvaZFsxC_cCoiMJ52QEDh1uI5x4";

export const getCoordsForAddress = async (address) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  return data.results[0].geometry.location;
};
