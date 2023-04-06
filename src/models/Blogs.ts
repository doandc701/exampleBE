import mongoose from "mongoose";
// import { beautifyUnique } from "mongoose-beautiful-unique-validation";
const beautifyUnique = require("mongoose-beautiful-unique-validation");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    name: String,
    author: String,
    hidden: Boolean,
    slug: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);
blogSchema.plugin(beautifyUnique);
export default mongoose.model("Blogs", blogSchema);
