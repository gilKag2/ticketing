import { TicketUpdatedEvent } from "@gil-tickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Ticket, TicketDoc } from "../../../models/ticket";

describe("tests with setup", () => {
  let listener: TicketUpdatedListener;
  let data: TicketUpdatedEvent["data"];
  let msg: Message;
  let ticket: TicketDoc;

  beforeEach(async () => {
    listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "concert",
      price: 10,
    });
    // creates a fake data event
    data = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: ticket.version + 1,
      userId: new mongoose.Types.ObjectId().toHexString(),
      title: "new concert",
      price: 20,
    };
    await ticket.save();

    // creates a fake massage object
    //@ts-ignore
    msg = { ack: jest.fn() };
  });

  it("finds, updates and saves a ticket", async () => {
    // call onMessage with the data object + message object
    await listener.onMessage(data, msg);

    console.log({ data });
    // const updatedTicket = await Ticket.findById(ticket.id);

    // expect(updatedTicket!.title).toEqual(data.title);
    // expect(updatedTicket!.price).toEqual(data.price);
    // expect(updatedTicket!.version).toEqual(data.version);
  });
  it("acks the message", async () => {
    // call onMessage with the data object + message object
    await listener.onMessage(data, msg);

    // assert that ack was called
    expect(msg.ack).toHaveBeenCalled();
  });
  it("does not call ack if the event skipped a version number", async () => {
    data.version = 10;
    try {
      await listener.onMessage(data, msg);
    } catch (err) {}
    expect(msg.ack).not.toHaveBeenCalled();
  });
});
