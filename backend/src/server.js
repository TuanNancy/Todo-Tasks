import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import taskRoute from "./routes/tasksRouters.js";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration - luôn bật để frontend có thể gọi API
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "*"
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 5001;

// API routes
app.use("/api/tasks", taskRoute);

// Serve static files và SPA routing cho production
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDistPath));

  // Catch-all handler: gửi về index.html cho mọi route không phải API
  // Sử dụng middleware thay vì route pattern để tránh lỗi với Express 5.x
  app.use((req, res, next) => {
    // Bỏ qua các route API
    if (req.path.startsWith("/api")) {
      return next();
    }
    // Gửi về index.html cho SPA routing
    res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) {
        next(err);
      }
    });
  });
}

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`server bắt đầu ở cổng: ${port}!`));
  })
  .catch((error) => {
    console.error("Lỗi khi kết nối đến MongoDB", error);
    process.exit(1);
  });
