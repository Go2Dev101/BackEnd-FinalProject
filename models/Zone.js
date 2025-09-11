import { Schema, model } from "mongoose";

const ZoneSchema = new Schema(
  {
    zoneName: { type: String, unique: true, required: true },
    postalCodes: {
      type: [String],
      default: [],
      required: true,
      validate: {
        validator: (arr) => new Set(arr).size === arr.length,
        message: "Postal codes must be unique within a zone",
      },
    },
    shippingFee: { type: Number, min: 0, required: true },
  },
  { timestamps: true }
);

ZoneSchema.pre("save", async function (next) {
  const overlapping = await Zone.findOne({
    _id: { $ne: this._id }, //Not Equal  this id
    postalCodes: { $in: this.postalCodes },
  });
  if (overlapping) {
    return next(new Error("Some postal codes already exist in another zone"));
  }
  next();
});

export const Zone = model("Zone", ZoneSchema);
