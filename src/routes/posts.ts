import { Router, Request, Response, NextFunction } from "express";
import { createPostSchema } from "../logic/postValidation.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
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
		return next(err);
	}
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const term = req.query.term;
		const articles =
			typeof term === "string"
				? await prisma.post.findMany({
						where: {
							OR: [
								{ title: { contains: term, mode: "insensitive" } },
								{ content: { contains: term, mode: "insensitive" } },
								{ category: { contains: term, mode: "insensitive" } },
							],
						},
					})
				: await prisma.post.findMany();
		return res.status(200).json(articles);
	} catch (err) {
		return next(err);
	}
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id);
		const article = await prisma.post.findUnique({ where: { id: id } });
		if (!article) return res.status(404).json({ message: "Article not found" });
		return res.status(200).json(article);
	} catch (err) {
		return next(err);
	}
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id);
		const updatedArticle = req.body;
		const result = createPostSchema.safeParse(updatedArticle);

		if (!result.success)
			return res.status(400).json({ message: "Bad Request" });
		if (!(await prisma.post.findUnique({ where: { id: id } })))
			return res.status(404).json({ message: "Article not found" });

		const updatedPost = await prisma.post.update({
			where: { id: id },
			data: result.data,
		});
		return res.status(200).json(updatedPost);
	} catch (err) {
		return next(err);
	}
});

router.delete(
	"/:id",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const id = Number(req.params.id);
			if (!(await prisma.post.findUnique({ where: { id: id } })))
				return res.status(404).json({ message: "Article not found" });

			await prisma.post.delete({ where: { id: id } });
			return res.sendStatus(204);
		} catch (err) {
			return next(err);
		}
	},
);

export default router;
