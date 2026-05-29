import express from "express";
import pool from "../pool/pool.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
    try {
        const existing = await pool.query(
            `
      SELECT d.*
      FROM daily_words dw
      JOIN dictionary d
        ON d.id = dw.word_id
      WHERE dw.day = CURRENT_DATE
      `
        );

        if (existing.rows.length > 0) {
            return res.json(existing.rows[0]);
        }

        const randomWord = await pool.query(
            `
      SELECT *
      FROM dictionary
      WHERE id NOT IN (
        SELECT word_id
        FROM daily_words
        WHERE day >= CURRENT_DATE - INTERVAL '7 days'
      )
      ORDER BY RANDOM()
      LIMIT 1
      `
        );

        if (randomWord.rows.length === 0) {
            return res.status(404).json({
                error: "No available words",
            });
        }

        const word = randomWord.rows[0];

        await pool.query(
            `
      INSERT INTO daily_words (day, word_id)
      VALUES (CURRENT_DATE, $1)
      `,
            [word.id]
        );

        res.json(word);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Failed to get daily word",
        });
    }
});

export default router;