import request from "supertest";
import { app } from "../../app";

it("fails when a email does not exists is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "123456" })
    .expect(400);
});

it("fails when incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123456" })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "126" })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123456" })
    .expect(201);
  const res = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "123456" })
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});
