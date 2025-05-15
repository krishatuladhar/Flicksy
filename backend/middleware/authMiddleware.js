import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import errorMiddleware from "./errorMiddleware.js"; 
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorMiddleware(res, 401, "No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return errorMiddleware(res, 404, "User not found");
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    return errorMiddleware(res, 401, "Invalid or expired token");
  }
};

export default authMiddleware;
