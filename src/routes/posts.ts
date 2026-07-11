import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	res.json({ message: "get all posts - not implemented yet" });
});

export default router;
