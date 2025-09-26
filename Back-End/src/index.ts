import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.ts";
import {connectDB} from "./lib/db.ts";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
  connectDB();
});
