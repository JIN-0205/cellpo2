// src/middleware/auth.ts
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../utils/types";

export const checkAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.isAuthenticated && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
