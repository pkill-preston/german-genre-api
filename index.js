import express from "express";
import pkg from "pg";
import cors from "cors";
import 'dotenv/config';

const { Pool } = pkg;

const app = express();
app.use(cors());

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("render")
    ? { rejectUnauthorized: false }
    : false
});

app.get("/nouns", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM nouns LIMIT 50"
  );
  res.json(result.rows);
});

app.get("/search", async (req, res) => {
  const q = req.query.q || "";

  const result = await pool.query(
    "SELECT * FROM nouns WHERE noun ILIKE $1 LIMIT 20",
    [q + "%"]
  );

  res.json(result.rows);
});

app.get("/random", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM nouns ORDER BY RANDOM() LIMIT 1"
  );
  res.json(result.rows[0]);
});

app.listen(3000, () => console.log("API running"));
