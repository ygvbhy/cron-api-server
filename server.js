const express = require("express");
const apiRouter = require("./api/index.js");

const app = express();
const PORT = 3000;

app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("✅ Root is working");
});

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
