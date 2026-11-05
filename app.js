import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import watchlistRoutes from "./routes/watchlist.js";

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found." }));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ error: status === 500 ? "Internal server error." : err.message });
});

export default app;