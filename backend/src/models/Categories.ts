import mongoose from "mongoose";

const { Schema } = mongoose;

const Categories = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);
export const ObjectCategories= mongoose.model("Categories", Categories);
