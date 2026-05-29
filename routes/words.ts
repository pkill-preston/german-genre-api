import express, { Request, Response } from "express";
import pool from "../pool/pool.ts"

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        let amount = parseInt(req.query.amount as string) || 10;

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

export default router;