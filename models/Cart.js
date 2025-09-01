import { Schema, model } from "mongoose";

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [
      {
        menuId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
        quantity: { type: Number, required: true, min: 1 },
        deliveryDate: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = model("Cart", CartSchema);
