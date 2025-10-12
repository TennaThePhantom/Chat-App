import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

// for future increase image size limit it can only take image under 100KB Rn check notes to see fix maybe
dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve()

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
if(process.env.NODE_ENV==="production"){
	app.use(express.static(path.join(__dirname, "../Front-End/dist")))

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../Front-End", "dist", "index.html"))
	})
}

// Start server
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectDB();
});
