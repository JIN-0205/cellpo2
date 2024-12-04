declare namespace Express {
  interface Request {
    session?: {
      isAuthenticated?: boolean;
      userId?: string;
      [key: string]: any;
    };
  }
}
