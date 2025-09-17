import jwt from "jsonwebtoken";

// Middleware to authenticate user using JWT
export const authUser = (req, res, next) => {
  const token = req.cookies?.accessToken;
  const tokenHeader = req.headers?.authorization.split(" ")[1];

  if (!token && !tokenHeader) {
    const error = new Error("Authentication token missing!");
    error.status = 401;
    return next(error);
  }
  try {
    const decoded_token = jwt.verify(
      token || tokenHeader,
      process.env.JWT_SECRET
    );
    req.user = { user: { _id: decoded_token.userId } };
    next();
  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    res.status(401).json({
      error: true,
      code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
      message: isExpired
        ? "Token has expired, please log in again."
        : "Invalid token.",
    });
  }
};
