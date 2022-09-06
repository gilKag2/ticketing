import { ExpirationCompletedEvent, OrderStatus } from "@gil-tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Ticket, TicketDoc } from "../../../models/ticket";
import mongoose from "mongoose";
import { Order, OrderDoc } from "../../../models/order";

describe("tests with setup", () => {
  let listener: ExpirationCompleteListener;
  let data: ExpirationCompletedEvent["data"];
  let msg: Message;
  let ticket: TicketDoc;
  let order: OrderDoc;
  beforeEach(async () => {
    // create an instance of the listener
    listener = new ExpirationCompleteListener(natsWrapper.client);

    ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "concert",
      price: 20,
    });
    await ticket.save();

    order = Order.build({
      status: OrderStatus.Created,
      userId: "ok",
      expiresAt: new Date(),
      ticket,
    });

    await order.save();
    // creates a fake data event
    data = {
      orderId: order.id,
    };

    // creates a fake massage object
    //@ts-ignore
    msg = { ack: jest.fn() };
  });
  it("updated the order status to cancelled", async () => {
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it("emits an order cancelled event", async () => {
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(order.id);
  });
  it("acks the message", async () => {
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
