const express = require("express");
const app = express();
const fs = require("fs/promises");
const path = require("path");
const axios = require("axios");

app.use(express.json());

console.log("✅ index.js loaded");

app.get("/api/save-hot-post", async (req, res) => {
  console.log("📩 /save-hot-post route hit");
  try {
    const { data } = await axios.get("http://13.125.208.179:5011/channels");

    const channelsData = data.map((item) => item._id);
    let hotPosts = [];

    for (const channel of channelsData) {
      const { data } = await axios.get(
        `http://13.125.208.179:5011/posts/channel/${channel}?limit=100`
      );
      hotPosts = [...hotPosts, ...data];
    }

    hotPosts.sort((a, b) => b.likes.length - a.likes.length);
    const hotPostsData = hotPosts.slice(0, 8);

    const filePath = path.join("/tmp", "hot-post.json");
    await fs.writeFile(filePath, JSON.stringify(hotPostsData, null, 2));

    res.status(200).send("Hot post saved!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/read-hot-post", async (req, res) => {
  try {
    const filePath = path.join("/tmp", "hot-post.json");
    const content = await fs.readFile(filePath, "utf-8");
    res.status(200).json(JSON.parse(content));
  } catch (error) {
    res.status(404).send("❌ hot-post.json not found");
  }
});

app.get("/api/save-new-post", async (req, res) => {
  console.log("📩 /save-new-post route hit");
  try {
    const { data } = await axios.get("http://13.125.208.179:5011/channels");

    const channelsData = data.map((item) => item._id);
    let newPosts = [];

    for (const channel of channelsData) {
      const { data } = await axios.get(
        `http://13.125.208.179:5011/posts/channel/${channel}?limit=100&sort=createdAt:desc`
      );
      newPosts = [...newPosts, ...data];
    }

    newPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const newPostsData = newPosts.slice(0, 8);

    const filePath = path.join("/tmp", "new-post.json");
    await fs.writeFile(filePath, JSON.stringify(newPostsData, null, 2));

    res.status(200).send("New post saved!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/read-new-post", async (req, res) => {
  try {
    const filePath = path.join("/tmp", "new-post.json");
    const content = await fs.readFile(filePath, "utf-8");
    res.status(200).json(JSON.parse(content));
  } catch (error) {
    res.status(404).send("❌ new-post.json not found");
  }
});

// Catch-all
app.use((req, res) => {
  res.status(404).send("❌ Not found");
});

module.exports = app;
