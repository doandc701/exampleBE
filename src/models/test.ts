import mongoose from "mongoose";
const slug = require("mongoose-slug-generator");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const { Schema } = mongoose;
// add plugin
// mongoose.plugin(slug);
const test = new Schema(
  {
    name: String,
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);
// test.plugin(beautifyUnique);
export const ObjeTest = mongoose.model("Test", test);
