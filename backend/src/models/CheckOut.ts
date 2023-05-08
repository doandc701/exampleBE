import mongoose from "mongoose";

const { Schema } = mongoose;

const CheckOuts = new Schema(
  {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    note: { type: String },
    size: { type: String },
    nameProduct: { type: String },
    price: { type: String },
    quantity: { type: Number },
    totalPrice: { type: String },
  },
  {
    timestamps: true,
  }
);
export const ObjectCheckOuts = mongoose.model("CheckOuts", CheckOuts);
