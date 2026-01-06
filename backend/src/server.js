import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import taskRoute from "./routes/tasksRouters.js";
import connectDB from "./config/db.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true,
  })
);

app.use(express.json());

const port = 5001;

app.use("/api/tasks", taskRoute);

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`server bắt đầu ở cổng: ${port}!`));
  })
  .catch((error) => {
    console.error("Lỗi khi kết nối đến MongoDB", error);
    process.exit(1);
  });
