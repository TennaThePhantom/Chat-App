import express from 'express';
import authRoutes from './routes/auth.route.ts'

const app = express();
const PORT = 5001;

app.use("/api/auth", authRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

