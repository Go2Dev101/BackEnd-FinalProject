import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const AddressSchema = new Schema(
  {
    streetAddress: { type: String },
    subDistrict: { type: String },
    district: { type: String },
    province: { type: String, default: "Bangkok" },
    postalCode: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: AddressSchema },
    cart: {
        type: [
          {
            menuId: {
              type: Schema.Types.ObjectId,
              ref: "Menu",
              required: true,
            },
            quantity: { type: Number, required: true, min: 1 },
            deliveryDate: { type: String },
          },
        ],
        default: [],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model("User", UserSchema);
