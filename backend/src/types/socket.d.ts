import { Socket } from "socket.io";

export interface ServerToClientEvents {
  playerJoined: (players: any[]) => void;
  startGame: () => void;
  moveMade: (move: any) => void;
}

export interface ClientToServerEvents {
  joinRoom: (data: { roomId: string; userId: string }) => void;
  makeMove: (data: { roomId: string; move: any }) => void;
  gameOver: (data: { roomId: string; winnerId: string }) => void;
}

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
