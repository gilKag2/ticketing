import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@gil-tickets/common";
import { CreateTicketRouter } from "./routes/new";
import { ShowTicketRouter } from "./routes/show";
import { IndexTicketRouter } from "./routes/index";
import { UpdateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(CreateTicketRouter);
app.use(ShowTicketRouter);
app.use(IndexTicketRouter);
app.use(UpdateTicketRouter);
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
