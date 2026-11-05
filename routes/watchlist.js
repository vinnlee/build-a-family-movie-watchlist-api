import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  findById,
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = express.Router();

// Every watchlist route requires a valid token
router.use(authenticate);

function parseParams(req, res, next) {
  req.userId = Number(req.params.userId);
  if (req.params.movieId !== undefined) {
    req.movieId = Number(req.params.movieId);
  }
  if (!findById(req.userId)) {
    return res.status(404).json({ error: "User not found." });
  }
  next();
}

// Any authenticated user can read any watchlist
router.get("/:userId", parseParams, (req, res) => {
  res.status(200).json(getWatchlist(req.userId));
});

router.post(
  "/:userId/movies",
  authorizeModification,
  parseParams,
  (req, res) => {
    const { title, genre } = req.body || {};
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required." });
    }
    if (genre !== undefined && typeof genre !== "string") {
      return res.status(400).json({ error: "Genre must be a string." });
    }

    const movie = addMovie(req.userId, { title, genre });
    res.status(201).json(movie);
  },
);

router.put(
  "/:userId/movies/:movieId",
  authorizeModification,
  parseParams,
  (req, res) => {
    const { title, genre, watched } = req.body || {};
    const updates = {};

    if (title !== undefined) {
      if (!title || typeof title !== "string") {
        return res
          .status(400)
          .json({ error: "Title must be a non-empty string." });
      }
      updates.title = title;
    }
    if (genre !== undefined) {
      if (typeof genre !== "string") {
        return res.status(400).json({ error: "Genre must be a string." });
      }
      updates.genre = genre;
    }
    if (watched !== undefined) {
      if (typeof watched !== "boolean") {
        return res.status(400).json({ error: "Watched must be a boolean." });
      }
      updates.watched = watched;
    }

    const movie = updateMovie(req.userId, req.movieId, updates);
    if (!movie) return res.status(404).json({ error: "Movie not found." });

    res.status(200).json(movie);
  },
);

router.delete(
  "/:userId/movies/:movieId",
  authorizeModification,
  parseParams,
  (req, res) => {
    if (!deleteMovie(req.userId, req.movieId)) {
      return res.status(404).json({ error: "Movie not found." });
    }
    res.status(200).json({ message: "Movie removed." });
  },
);

export default router;