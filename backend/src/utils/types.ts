// src/utils/types.ts
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  session?: {
    isAuthenticated?: boolean;
    userId?: string;
    playerSymbol?: "X" | "O";
    [key: string]: any;
  };
}
