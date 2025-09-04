import { Schema, model } from "mongoose";

const MealSchema = new Schema(
  {
    day: { type: Number, required: true },
    breakfast: { type: String, required: true },
    lunch: { type: String, required: true },
    dinner: { type: String, required: true },
  },
  { _id: false }
);

const InformationSchema = new Schema(
  {
    description: { type: String },
    meals: [MealSchema],
  },
  { _id: false }
);
const NutritionFactsSchema = new Schema(
  {
    kcal: { type: Number, min: 0 },
    gTotalFat: { type: Number, min: 0 },
    gSaturatesFat: { type: Number, min: 0 },
    gTransFat: { type: Number, min: 0 },
    mgCholesterol: { type: Number, min: 0 },
    mgSodium: { type: Number, min: 0 },
    gTotalCarb: { type: Number, min: 0 },
    gFiber: { type: Number, min: 0 },
    gSugars: { type: Number, min: 0 },
    gProtein: { type: Number, min: 0 },
  },
  { _id: false }
);

const MenuSchema = new Schema(
  {
    title: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    category: { type: String, required: true },
    durationDays: { type: Number, default: 1 },
    information: { type: InformationSchema },
    nutritionFacts: { type: NutritionFactsSchema },
  },
  { timestamps: true }
);

export const Menu = model("Menu", MenuSchema);
