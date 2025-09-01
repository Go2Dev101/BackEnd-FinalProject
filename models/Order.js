import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        menuId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        deliveryDate: { type: String },
      },
      { _id: false },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = model("Order", OrderSchema);
