import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "https://localhost:4222",
});

stan.on("connect", () => {
  console.log("listening");

  stan.on("close", () => {
    console.log("nats connection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());

process.on("SIGTERM", () => stan.close());
