import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { app } from "./app.js";
import connectDB from "./db/index.js";

// const server = http.createServer(app);

const PORT = process.env.PORT || 4001;
// const server = app.listen(PORT);

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is running on port: ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

