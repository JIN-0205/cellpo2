// src/routes/user.routes.ts
import { Router } from "express";
import userController from "../controllers/user.controller";
import { checkAuth } from "../middleware/auth";

const userRouter = Router();

userRouter.get("/profile", checkAuth, userController.userProfile);
userRouter.get("/", checkAuth, userController.getAllUsers);
userRouter.get("/logout", checkAuth, userController.logoutUser);
userRouter.get("/:id", checkAuth, userController.getUserById);

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);

userRouter.put("/:id", checkAuth, userController.updateUser);
userRouter.delete("/:id", checkAuth, userController.deleteUserById);

export default userRouter;
