// src/controllers/game.controller.ts
import { Response } from "express";
import { User } from "../models/user.model";
import { AuthenticatedRequest } from "../utils/types";

const updateGameResult = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.session?.userId;
    const { winner } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // matches をインクリメント
    user.matches += 1;

    // 勝者であれば wins をインクリメント
    if (winner === "Draw") {
      // 引き分けの場合は wins を更新しない
    } else if (winner === "X" || winner === "O") {
      // プレイヤーのシンボルをセッションから取得する必要があります
      const playerSymbol = req.session?.playerSymbol;
      if (winner === playerSymbol) {
        user.win += 1;
      }
    }

    await user.save();

    res.status(200).json({ message: "Game result updated" });
  } catch (error) {
    console.error("Update Game Result Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default {
  updateGameResult,
};
