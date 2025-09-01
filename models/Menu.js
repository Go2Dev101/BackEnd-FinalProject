import { Schema, model } from "mongoose";

const MenuSchema = new Schema(
  {
    title: { type: String, unique: true, required: true },
    slug: { type: String },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    category: { type: String, required: true },
    kcal: { type: Number, min: 0 },
  },
  { timestamps: true }
);

export const Menu = model("Menu", MenuSchema);
