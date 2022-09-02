import { TicketCreatedEvent } from "@gil-tickets/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

describe("tests with setup", () => {
  let listener: TicketCreatedListener;
  let data: TicketCreatedEvent["data"];
  let msg: Message;
  beforeEach(() => {
    // create an instance of the listener
    listener = new TicketCreatedListener(natsWrapper.client);

    // creates a fake data event
    data = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      userId: new mongoose.Types.ObjectId().toHexString(),
      title: "concert",
      price: 20,
    };

    // creates a fake massage object
    //@ts-ignore
    msg = { ack: jest.fn() };
  });
  it("creates and saves a ticket", async () => {
    // call onMessage with the data object + message object
    await listener.onMessage(data, msg);

    // assert that the ticket was created
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.price).toEqual(data.price);
  });

  it("acks the message", async () => {
    // call onMessage with the data object + message object
    await listener.onMessage(data, msg);

    // assert that ack was called
    expect(msg.ack).toHaveBeenCalled();
  });
});
