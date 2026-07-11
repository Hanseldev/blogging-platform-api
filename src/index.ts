import express from "express";
import postsRouter from "./routes/posts.js";

const app = express();
app.use(express.json());

app.use("/posts", postsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
