import { Server } from "socket.io";
import http from "http";
import express from "express";

interface UserSocketMap {
	[key: string]: string;
}
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

// stores the online users
const userSocketMap: UserSocketMap = {};

io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId) {
		const id = Array.isArray(userId) ? userId[0] : userId;
		userSocketMap[id] = socket.id;
	}
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("A user disconnected", socket.id);
		if (userId) {
			const id = Array.isArray(userId) ? userId[0] : userId;
			userSocketMap[id] = socket.id;
			delete userSocketMap[id];
			io.emit("getOnlineUsers", Object.keys(userSocketMap));
		}
	});
});

export { io, app, server };
