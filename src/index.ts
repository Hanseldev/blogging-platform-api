import "dotenv/config";
import express, { NextFunction } from "express";
import { Request, Response } from "express";

import postsRouter from "./routes/posts.js";

const app = express();
app.use(express.json());

app.use("/posts", postsRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err);
	res.status(500).json({ error: "Internal server error" });
});

app.use((req: Request, res: Response) => {
	res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
