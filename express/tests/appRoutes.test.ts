import request from "supertest";

import app from "../app";
import { getLists, resetDatabase } from "../models";

describe("app routes", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("signs up and logs in a user", async () => {
    const signupResponse = await request(app)
      .post("/auth/signup")
      .send({ email: "route@example.com", password: "secret123" });

    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body).toEqual({
      message: "User created successfully",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ email: "route@example.com", password: "secret123" });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.message).toBe("Login successful");
    expect(loginResponse.body.accessToken).toBeTruthy();
    expect(loginResponse.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")]),
    );
  });

  it("rejects protected list access without a bearer token", async () => {
    const response = await request(app).get("/lists");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Missing authorization header",
    });
  });

  it("creates a list with a valid access token", async () => {
    await request(app)
      .post("/auth/signup")
      .send({ email: "lists@example.com", password: "secret123" });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ email: "lists@example.com", password: "secret123" });
    const token = loginResponse.body.accessToken as string;

    const createResponse = await request(app)
      .post("/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Groceries" });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.name).toBe("Groceries");
    await expect(getLists()).resolves.toHaveLength(1);
  });
});
