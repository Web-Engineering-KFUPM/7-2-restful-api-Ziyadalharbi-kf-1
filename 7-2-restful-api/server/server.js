import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./db.js";
import { Song } from "./models/song.model.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
await connectDB(process.env.MONGO_URL);


// ✅ GET all songs (READ)
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ POST new song (CREATE)
app.post("/api/songs", async (req, res) => {
  try {
    const newSong = await Song.create(req.body);
    res.status(201).json(newSong);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ PUT update song (UPDATE)
app.put("/api/songs/:id", async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSong);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE song (DELETE)
app.delete("/api/songs/:id", async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => 
  console.log(`API running on http://localhost:${PORT}`)
);