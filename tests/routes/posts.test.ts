import { describe, test, expect } from "vitest";
import { createPostSchema } from "../../src/logic/postValidation.js";

const validPost = {
	title: "Test",
	content: "This is a test",
	category: "Unit tests",
	tags: ["tech"],
};

describe("createPostSchema", () => {
	test("accepts valid data", () => {
		const result = createPostSchema.safeParse(validPost);
		expect(result.success).toBe(true);
	});

	test("rejects empty title", () => {
		const result = createPostSchema.safeParse({ ...validPost, title: "" });
		expect(result.success).toBe(false);
	});

	test("rejects empty content", () => {
		const result = createPostSchema.safeParse({ ...validPost, content: "" });
		expect(result.success).toBe(false);
	});

	test("rejects empty category", () => {
		const result = createPostSchema.safeParse({ ...validPost, category: "" });
		expect(result.success).toBe(false);
	});

	test("rejects empty tags array", () => {
		const result = createPostSchema.safeParse({ ...validPost, tags: [] });
		expect(result.success).toBe(false);
	});

	test("rejects tags array with an empty string", () => {
		const result = createPostSchema.safeParse({ ...validPost, tags: [""] });
		expect(result.success).toBe(false);
	});
});

