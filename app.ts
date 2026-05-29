import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import wordsRoute from "./routes/words.js";
import searchRoute from "./routes/search.js";
import randomRoute from "./routes/random.js";
import dailyWordRoute from "./routes/dailyWord.js";

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