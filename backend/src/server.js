import dotenv from "dotenv";
dotenv.config();

import express from "express";
import taskRoute from "./routes/tasksRouters.js";
import connectDB from "./config/db.js";

const app = express();

connectDB();

const port = 5001;

app.use("/api/tasks", taskRoute);

app.listen(port, () => console.log(`server bắt đầu ở cổng: ${port}!`));
