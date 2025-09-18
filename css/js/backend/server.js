const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const DATA_DIR = path.join(__dirname, "data");
const SCORE_FILE = path.join(DATA_DIR, "scores.json");

// ✅ serve static files from project root (or wherever login.html is)
app.use(express.static(path.join(__dirname, "..")));



// ensure data folder/file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(SCORE_FILE)) fs.writeFileSync(SCORE_FILE, JSON.stringify({}, null, 2));

// utils
const readScores = () => JSON.parse(fs.readFileSync(SCORE_FILE, "utf-8"));
const writeScores = (obj) => fs.writeFileSync(SCORE_FILE, JSON.stringify(obj, null, 2));

// save/overwrite a level score
app.post("/save-score", (req, res) => {
  const { username, level, score } = req.body;
  if (!username || !level || typeof score !== "number") {
    return res.status(400).json({ error: "username, level, score are required" });
  }

  const scores = readScores();
  if (!scores[username]) scores[username] = { levels: {}, lastUpdated: null };

  scores[username].levels[level] = score;
  scores[username].lastUpdated = new Date().toISOString();
  writeScores(scores);

  res.json({ message: "Score saved", levels: scores[username].levels });
});

// get all progress for a user
app.get("/get-progress/:username", (req, res) => {
  const { username } = req.params;
  const scores = readScores();
  const user = scores[username] || { levels: {}, lastUpdated: null };
  const total = Object.values(user.levels).reduce(
    (a, b) => a + (typeof b === "number" ? b : 0),
    0
  );
  res.json({ username, levels: user.levels, total, lastUpdated: user.lastUpdated });
});

// simple health check
app.get("/health", (_, res) => res.json({ ok: true }));

// default route -> login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "login.html"));
});

app.listen(PORT, () =>
  console.log(`✅ API + Frontend running at http://localhost:${PORT}`)
);

