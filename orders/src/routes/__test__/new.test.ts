import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

describe("tests with validation", () => {
  let cookie: string[] = [];
  let createdTicket: TicketDoc;

  beforeEach(async () => {
    cookie = global.signin();
    createdTicket = Ticket.build({
      title: "concert",
      price: 20,
      id: new mongoose.Types.ObjectId().toHexString(),
    });
    await createdTicket.save();
  });

  it("returns an error if the ticket does not exists", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId })
      .expect(404);
  });
  it("returns an error if the ticket is already reserved", async () => {
    const order = Order.build({
      userId: "yes ok",
      status: OrderStatus.Created,
      expiresAt: new Date(),
      ticket: createdTicket,
    });
    await order.save();
    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: createdTicket.id })
      .expect(400);
  });

  it("reserves a ticket", async () => {
    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: createdTicket.id })
      .expect(201);
  });

  it("emits an order created event", async () => {
    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: createdTicket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
