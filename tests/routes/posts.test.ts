import { describe, test, expect, beforeEach } from "vitest";
import { createPostSchema } from "../../src/logic/postValidation.js";
import { prisma } from "../../src/lib/prisma.js";
import request from "supertest";
import { app } from "../../src/app.js";

const validPost = {
	title: "Test",
	content: "This is a test",
	category: "Unit tests",
	tags: ["tech"],
};

beforeEach(async () => {
	await prisma.post.deleteMany();
});

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

describe("POST /posts", () => {
	test("creates a post and returns 201", async () => {
		const res = await request(app)
			.post("/posts")
			.send({
				title: "Test Post",
				content: "Test content",
				category: "Testing",
				tags: ["test"],
			});

		expect(res.status).toBe(201);
		expect(res.body.title).toBe("Test Post");
		expect(res.body.id).toBeDefined();
	});

	test("returns 400 for invalid data", async () => {
		const res = await request(app)
			.post("/posts")
			.send({
				title: "",
				content: "Test content",
				category: "Testing",
				tags: ["test"],
			});

		expect(res.status).toBe(400);
	});
});

describe("GET /posts/:id", () => {
	test("returns the specified post", async () => {
		const createRes = await request(app).post("/posts").send(validPost);
		const result = await request(app).get(`/posts/${createRes.body.id}`);

		expect(result.status).toBe(200);
		expect(result.body.title).toBe("Test");
	});

	test("returns a 404 status code when post is not found", async () => {
		// no post in the post database
		const result = await request(app).get(`/posts/${1}`);

		expect(result.status).toBe(404);
	});
});

describe("GET /posts", () => {
	test("returns all posts", async () => {
		await request(app).post("/posts").send(validPost);
		await request(app)
			.post("/posts")
			.send({ ...validPost, title: "Second" });

		const res = await request(app).get("/posts");

		expect(res.status).toBe(200);
		expect(res.body.length).toBe(2);
	});

	test("filters posts by term", async () => {
		await request(app).post("/posts").send(validPost);
		await request(app)
			.post("/posts")
			.send({ ...validPost, title: "Banana", category: "Food" });

		const res = await request(app).get("/posts?term=unit");

		expect(res.status).toBe(200);
		expect(res.body.length).toBe(1);
	});
});

describe("PUT /posts/:id", () => {
	test("updates an existing post", async () => {
		const createRes = await request(app).post("/posts").send(validPost);
		const updated = { ...validPost, title: "Updated Title" };

		const res = await request(app)
			.put(`/posts/${createRes.body.id}`)
			.send(updated);

		expect(res.status).toBe(200);
		expect(res.body.title).toBe("Updated Title");
	});

	test("returns 404 when post does not exist", async () => {
		const res = await request(app).put("/posts/1").send(validPost);
		expect(res.status).toBe(404);
	});

	test("returns 400 for invalid body", async () => {
		const createRes = await request(app).post("/posts").send(validPost);
		const res = await request(app)
			.put(`/posts/${createRes.body.id}`)
			.send({ ...validPost, title: "" });
		expect(res.status).toBe(400);
	});
});

describe("DELETE /posts/:id", () => {
	test("deletes an existing post", async () => {
		const createRes = await request(app).post("/posts").send(validPost);
		const res = await request(app).delete(`/posts/${createRes.body.id}`);
		expect(res.status).toBe(204);
	});

	test("returns 404 when post does not exist", async () => {
		const res = await request(app).delete("/posts/1");
		expect(res.status).toBe(404);
	});
});
