import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import {
  signinRouter,
  signoutRouter,
  signupRouter,
  currentUserRouter,
} from "./routes";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to mongodb");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => console.log("listening on port 3000!!"));
};

start();
