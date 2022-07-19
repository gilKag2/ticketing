import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "assfsafa";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // build a JWT payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  // create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build the session object
  const session = { jwt: token };
  // turn the session into json
  const sessionJson = JSON.stringify(session);
  // take json and encode it as base64
  const base64 = Buffer.from(sessionJson).toString("base64");

  // return a string that is the cookie with the encoded data
  return [`session=${base64}`];
};
