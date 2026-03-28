const express = require("express");
const mysql   = require("mysql2/promise");
const cors    = require("cors");
const helmet  = require("helmet");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// MySQL connection pool
const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               process.env.DB_PORT || 3306,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
});

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected", uptime: process.uptime() });
  } catch (e) {
    res.status(503).json({ status: "error", db: "disconnected" });
  }
});

// GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM todos ORDER BY created_at DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// POST create todo
app.post("/api/todos", async (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: "Title required" });
  try {
    const [r] = await pool.query(
      "INSERT INTO todos (title, completed) VALUES (?, false)", [title.trim()]
    );
    res.status(201).json({ id: r.insertId, title: title.trim(), completed: false });
  } catch (e) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// PUT update todo
app.put("/api/todos/:id", async (req, res) => {
  const { completed } = req.body;
  try {
    await pool.query("UPDATE todos SET completed = ? WHERE id = ?", [completed, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM todos WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Todo API running on port ${PORT} [${process.env.NODE_ENV}]`)
);

module.exports = app;
