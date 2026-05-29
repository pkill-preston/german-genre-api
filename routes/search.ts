import express, { Request, Response } from "express";
import pool from "../pool/pool.js"

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const q = (req.query.q as string) || "";

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

export default router;