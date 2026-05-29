import express, { Request, Response } from "express";
import pool from "../pool/pool.ts"

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
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

export default router;