import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./db/index.js";
import feedbackRoutes from "./routes/feedback.route.js";
import userRoutes from "./routes/user.route.js";
import taskRoutes from "./routes/task.route.js";

dotenv.config({ path: ".env" });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: `*`,
    credentials: true,
  })
);

// Connecting to MongoDB and listening
const port = process.env.PORT || 4000;
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// Define routes
app.use("/api/feedback", feedbackRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

export { app };
