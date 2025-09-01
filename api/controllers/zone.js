import { Zone } from "../../models/Zone.js";

// create a new zone
export const createZone = async (req, res, next) => {
  const { zoneName, postalCodes = [], shippingFee } = req.body;

  if (!zoneName || !postalCodes || !shippingFee) {
    const error = new Error(
      "ZoneName, postalCodes and shippingFee  are required!"
    );
    error.status = 400;
    return next(error);
  }

  try {
    const existingZone = await Zone.findOne({ zoneName });

    if (existingZone) {
      const error = new Error("Zone name already in use!");
      error.status = 409;
      return next(error);
    }

    const zone = await Zone.create({ zoneName, postalCodes, shippingFee });
    res
      .status(201)
      .json({ error: false, zone, message: "Zone created successfully!" });
  } catch (err) {
    next(err);
  }
};

// get all zones
export const getAllZones = async (req, res, next) => {
  try {
    const zones = await Zone.find().sort({ createdAt: -1 });
    res.status(200).json({
      error: false,
      zones,
      message: "All zones retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// edit zone
export const editZone = async (req, res, next) => {
  const { zoneId } = req.params;
  const { zoneName, postalCodes, shippingFee } = req.body;

  try {
    const zone = await Zone.findOne({ _id: zoneId });

    if (!zone) {
      const error = new Error("Zone not found!");
      error.status = 404;
      return next(error);
    }

    if (zoneName) {
      if (zoneName === zone.zoneName) {
        const error = new Error("Zone name already in use!");
        error.status = 409;
        return next(error);
      }
      zone.zoneName = zoneName;
    }
    if (postalCodes) zone.postalCodes = postalCodes;
    if (shippingFee) zone.shippingFee = shippingFee;

    await zone.save();
    res.status(200).json({
      error: false,
      zone,
      message: "Zone updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};
