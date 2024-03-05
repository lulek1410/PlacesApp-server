import { Schema, Types, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlenght: 6 },
  image: { type: String, required: true },
  places: [{ type: Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.plugin(uniqueValidator);

export const User = model("User", userSchema);
