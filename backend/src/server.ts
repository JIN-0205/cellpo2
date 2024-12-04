// src/server.ts
import express, { Response, Request } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import userRouter from "./routes/user.routes";
import gameRouter from "./routes/game.routes";
import { AuthenticatedRequest } from "./utils/types";

dotenv.config();

// Create server
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    credentials: true,
  },
});

// セッションミドルウェアの設定
const sessionMiddleware = cookieSession({
  name: "session",
  keys: [
    process.env.COOKIE_SIGN_KEY ?? "default_sign_key",
    process.env.COOKIE_ENCRYPT_KEY ?? "default_encrypt_key",
  ],
  maxAge: 24 * 60 * 60 * 1000,
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

// Router
app.use("/api/users", userRouter);
app.use("/api/game", gameRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send("Access denied.");
});

// Socket.io とセッションの共有
io.use((socket, next) => {
  const req = socket.request as AuthenticatedRequest;
  const res = {} as Response;
  sessionMiddleware(req, res, next as any);
});

// Socket.io イベントハンドリング
interface Room {
  id: string;
  players: Socket[];
}

const rooms: { [key: string]: Room } = {};

io.on("connection", (socket: Socket) => {
  console.log("新しいクライアントが接続しました:", socket.id);

  socket.on("joinRoom", ({ roomId }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { id: roomId, players: [] };
    }

    if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(socket);
      socket.join(roomId);

      const symbol = rooms[roomId].players.length === 1 ? "X" : "O";
      socket.emit("startGame", { symbol });

      // ユーザーのセッションにプレイヤーシンボルを保存
      const req = socket.request as AuthenticatedRequest;
      if (req.session) {
        req.session.playerSymbol = symbol;
      }

      if (rooms[roomId].players.length === 2) {
        io.to(roomId).emit("updateBoard", {
          board: Array(9).fill(""),
          currentPlayer: "X",
        });
      }
    } else {
      socket.emit("roomFull");
    }
  });

  socket.on("makeMove", ({ board, currentPlayer }) => {
    const roomId = Array.from(socket.rooms)[1]; // 自分が参加している部屋ID

    io.to(roomId).emit("updateBoard", {
      board,
      currentPlayer: currentPlayer === "X" ? "O" : "X",
    });
  });

  socket.on("resetGame", ({ roomId }) => {
    io.to(roomId).emit("updateBoard", {
      board: Array(9).fill(""),
      currentPlayer: "X",
    });
  });

  socket.on("disconnect", () => {
    console.log("クライアントが切断しました:", socket.id);
    // 部屋からプレイヤーを削除する処理
    for (const roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(
        (player) => player.id !== socket.id
      );
      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 3010;
const MONGO_URI = process.env.MONGO_DB!;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
