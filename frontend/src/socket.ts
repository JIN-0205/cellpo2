// src/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3010", { withCredentials: true });

export default socket;