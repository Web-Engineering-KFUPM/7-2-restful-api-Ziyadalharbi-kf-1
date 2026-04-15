import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./db.js";
import { Song } from "./models/song.model.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());
app.use(express.json());

// Connect DB
await connectDB(process.env.MONGO_URL);

// ✅ GET all songs (newest first)
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET single song (with 404)
app.get("/api/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST create song (uses title & artist, 400 on error)
app.post("/api/songs", async (req, res) => {
  try {
    const { title, artist, year } = req.body;

    const newSong = await Song.create({
      title,
      artist,
      year,
    });

    res.status(201).json(newSong);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ PUT update song
app.put("/api/songs/:id", async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedSong === null) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json(updatedSong);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE song
app.delete("/api/songs/:id", async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);

    if (deletedSong === null) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});