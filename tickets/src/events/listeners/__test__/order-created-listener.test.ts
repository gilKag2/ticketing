import { OrderCreatedEvent, OrderStatus } from "@gil-tickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket, TicketDoc } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

describe("tests with setup", () => {
  let listener: OrderCreatedListener;
  let data: OrderCreatedEvent["data"];
  let msg: Message;
  let ticket: TicketDoc;

  beforeEach(async () => {
    listener = new OrderCreatedListener(natsWrapper.client);

    ticket = Ticket.build({
      userId: "yes",
      title: "concert",
      price: 10,
    });

    await ticket.save();

    data = {
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      userId: "ok",
      expiresAt: "not ok",
      ticket: {
        id: ticket.id,
        price: 20,
      },
    };
    //@ts-ignore
    msg = { ack: jest.fn() };
  });
  it("sets the userId of the ticket", async () => {
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
  });
  it("acks the message", async () => {
    // call onMessage with the data object + message object
    await listener.onMessage(data, msg);

    // assert that ack was called
    expect(msg.ack).toHaveBeenCalled();
  });
  it("published a ticket updated event", async () => {
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
