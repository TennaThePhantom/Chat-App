import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.ts";
import messageRoutes from "./routes/message.route.ts";
import { connectDB } from "./lib/db.ts";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.ts";

// for future increase image size limit it can only take image under 100KB Rn check notes to see fix maybe
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Start server
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectDB();
});
