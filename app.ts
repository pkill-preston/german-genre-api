import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import wordsRoute from "./routes/words.ts";
import searchRoute from "./routes/search.ts";
import randomRoute from "./routes/random.ts";
import dailyWordRoute from "./routes/dailyWord.ts";

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(cors());

app.use("/dailyWord", dailyWordRoute);
app.use("/words", wordsRoute);
app.use("/search", searchRoute);
app.use("/random", randomRoute);

export default app;