import { OrderCancelledEvent, OrderStatus } from "@gil-tickets/common";
import { Ticket, TicketDoc } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";

describe("tests with setup", () => {
  let listener: OrderCancelledListener;
  let data: OrderCancelledEvent["data"];
  let msg: Message;
  let ticket: TicketDoc;
  let orderId: string;

  beforeEach(async () => {
    listener = new OrderCancelledListener(natsWrapper.client);
    orderId = new mongoose.Types.ObjectId().toHexString();
    ticket = Ticket.build({
      userId: "yes",
      title: "concert",
      price: 10,
    });

    ticket.set({ orderId });

    await ticket.save();

    data = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      ticket: {
        id: ticket.id,
      },
    };
    //@ts-ignore
    msg = { ack: jest.fn() };
  });
  it("updated the ticket, publishes an event and acks the message", async () => {
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();

    expect(msg.ack).toHaveBeenCalled();

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
