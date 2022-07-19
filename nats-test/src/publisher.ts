import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();

const stan = nats.connect("ticketing", "acb", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "1",
      title: "ok",
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }
});
