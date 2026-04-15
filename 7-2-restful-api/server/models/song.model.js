import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: String,
    artist: String,
    year: Number,
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);