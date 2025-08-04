
import rateLimit from "express-rate-limit";
import express from "express";
import cors from "cors";
import productRouter from "./routes/products.routes.js";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests",
  statusCode: 429,
  headers: true,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/v1", productRouter);

export { app };
