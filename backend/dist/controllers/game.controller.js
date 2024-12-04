"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const updateGameResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
        const { winner } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // matches をインクリメント
        user.matches += 1;
        // 勝者であれば wins をインクリメント
        if (winner === "Draw") {
            // 引き分けの場合は wins を更新しない
        }
        else if (winner === "X" || winner === "O") {
            // プレイヤーのシンボルをセッションから取得する必要があります
            const playerSymbol = (_b = req.session) === null || _b === void 0 ? void 0 : _b.playerSymbol;
            if (winner === playerSymbol) {
                user.win += 1;
            }
        }
        yield user.save();
        res.status(200).json({ message: "Game result updated" });
    }
    catch (error) {
        console.error("Update Game Result Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.default = {
    updateGameResult,
};
