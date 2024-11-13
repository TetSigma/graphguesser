import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import gameRoutes from "./routes/gameRoutes";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

export default app;
