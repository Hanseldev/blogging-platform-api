import { Router, Request, Response } from "express";
import { createPostSchema } from "../logic/postValidation.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
	try {
		const article = req.body;
		const result = createPostSchema.safeParse(article);
		if (!result.success)
			return res.status(400).json({ message: "Bad Request" });

		const newPost = await prisma.post.create({
			data: result.data,
		});
		res.status(201).json(newPost);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/", (req: Request, res: Response) => {
	res.json({ message: "get all posts - not implemented yet" });
});



export default router;
