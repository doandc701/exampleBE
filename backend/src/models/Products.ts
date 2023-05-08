import mongoose from "mongoose";

const { Schema } = mongoose;

const Products = new Schema(
  {
    name: { type: String },
    images: { type: String },
    price: { type: Number },
    original_price: { type: Number },
    product_type: { type: String }, //new //hot
    description: { type: String },
    imagechild1: { type: String },
    imagechild2: { type: String },
    imagechild3: { type: String },
    categories: { type: String, ref: "Categories" },
  },
  {
    timestamps: true,
  }
);
export const ObjectProducts = mongoose.model("Products", Products);
