import { Publisher, OrderCreatedEvent, Subjects } from "@gil-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
