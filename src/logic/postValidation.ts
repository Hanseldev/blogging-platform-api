import { z } from "zod";

export const createPostSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
	category: z.string().min(1),
	tags: z.array(z.string().min(1)).min(1),
});
