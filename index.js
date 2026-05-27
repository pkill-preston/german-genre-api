import express from "express";
import pkg from "pg";
import cors from "cors";
import "dotenv/config";
import rateLimit from "express-rate-limit";

const { Pool } = pkg;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(cors());

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
  ssl: {rejectUnauthorized: false}
});

app.get("/words", async (req, res) => {
  try {
    let amount = parseInt(req.query.amount) || 10;

    if (amount > 50) amount = 50;

    const result = await pool.query(
        "SELECT * FROM dictionary ORDER BY RANDOM() LIMIT $1",
        [amount]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database query failed",
    });
  }
});

app.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";

    const result = await pool.query(
        "SELECT * FROM dictionary WHERE lemma ILIKE $1 LIMIT 20",
        [q + "%"]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database query failed",
    });
  }
});

app.get("/random", async (req, res) => {
  try {
    const result = await pool.query(
        "SELECT * FROM dictionary ORDER BY RANDOM() LIMIT 1"
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database query failed",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});