// src/routes/game.routes.ts
import { Router } from "express";
import gameController from "../controllers/game.controller";
import { checkAuth } from "../middleware/auth";

const gameRouter = Router();

gameRouter.post("/result", checkAuth, gameController.updateGameResult);

export default gameRouter;
