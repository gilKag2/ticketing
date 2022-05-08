import request from "supertest";
import { app } from "../../app";

it("signout successfully and cookie is defined", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123456" })
    .expect(201);
  const res = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);
  expect(res.get("Set-Cookie")).toBeDefined();
});
