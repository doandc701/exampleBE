import mongoose from "mongoose";

const { Schema } = mongoose;

const transactions = new Schema(
  {
    name: String,
    amount: String,
    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
  }
);
export const ObjectTest = mongoose.model("test", transactions);
