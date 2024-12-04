"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const game_routes_1 = __importDefault(require("./routes/game.routes"));
dotenv_1.default.config();
// Create server
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5174",
        credentials: true,
    },
});
// セッションミドルウェアの設定
const sessionMiddleware = (0, cookie_session_1.default)({
    name: "session",
    keys: [
        (_a = process.env.COOKIE_SIGN_KEY) !== null && _a !== void 0 ? _a : "default_sign_key",
        (_b = process.env.COOKIE_ENCRYPT_KEY) !== null && _b !== void 0 ? _b : "default_encrypt_key",
    ],
    maxAge: 24 * 60 * 60 * 1000,
});
// Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:5174",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(sessionMiddleware);
// Router
app.use("/api/users", user_routes_1.default);
app.use("/api/game", game_routes_1.default);
app.use((req, res) => {
    res.status(404).send("Access denied.");
});
// Socket.io とセッションの共有
io.use((socket, next) => {
    const req = socket.request;
    const res = {};
    sessionMiddleware(req, res, next);
});
const rooms = {};
io.on("connection", (socket) => {
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
            const req = socket.request;
            if (req.session) {
                req.session.playerSymbol = symbol;
            }
            if (rooms[roomId].players.length === 2) {
                io.to(roomId).emit("updateBoard", {
                    board: Array(9).fill(""),
                    currentPlayer: "X",
                });
            }
        }
        else {
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
            rooms[roomId].players = rooms[roomId].players.filter((player) => player.id !== socket.id);
            if (rooms[roomId].players.length === 0) {
                delete rooms[roomId];
            }
        }
    });
});
// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 3010;
const MONGO_URI = process.env.MONGO_DB;
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
})
    .catch((err) => console.error("Failed to connect to MongoDB", err));
