"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/game.routes.ts
const express_1 = require("express");
const game_controller_1 = __importDefault(require("../controllers/game.controller"));
const auth_1 = require("../middleware/auth");
const gameRouter = (0, express_1.Router)();
gameRouter.post("/result", auth_1.checkAuth, game_controller_1.default.updateGameResult);
exports.default = gameRouter;
