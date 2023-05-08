import mongoose from "mongoose";

const { Schema } = mongoose;

const User = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6 },
    avatar: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const ObjectUsers = mongoose.model("user", User);
