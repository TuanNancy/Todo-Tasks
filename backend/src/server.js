import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import taskRoute from "./routes/tasksRouters.js";
import authRoute from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (process.env.NODE_ENV === "development" || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5001;

// API routes
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);

// Serve static files và SPA routing cho production
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");

  // Kiểm tra xem thư mục dist có tồn tại không
  try {
    app.use(express.static(frontendDistPath));
    console.log(`📁 Serving static files from: ${frontendDistPath}`);

    // Catch-all handler: gửi về index.html cho mọi route không phải API
    app.use((req, res, next) => {
      // Bỏ qua các route API
      if (req.path.startsWith("/api")) {
        return next();
      }
      // Gửi về index.html cho SPA routing
      res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
        if (err) {
          console.error("Error sending index.html:", err);
          next(err);
        }
      });
    });
  } catch (error) {
    console.warn("⚠️  Frontend dist folder not found. API only mode.");
  }
}

// Start server ngay cả khi chưa kết nối MongoDB (để test API)
app.listen(port, () => {
  console.log(`🚀 Server đang chạy ở cổng: ${port}!`);
  console.log(`📡 API endpoint: http://localhost:${port}/api/tasks`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);

  // Kết nối MongoDB
  connectDB()
    .then(() => {
      console.log("✅ Kết nối MongoDB thành công!");
    })
    .catch((error) => {
      console.error("❌ Lỗi khi kết nối đến MongoDB:", error.message);
      console.log("⚠️  Server vẫn chạy nhưng không thể lưu dữ liệu!");
    });
});
